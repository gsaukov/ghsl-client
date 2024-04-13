import {Injectable} from '@angular/core';
import OlMap from "ol/Map";
import {transformExtent} from "ol/proj";
import {Polygon} from "ol/geom";
import {getBottomLeft, getBottomRight, getTopLeft, getTopRight} from "ol/extent"
import {meta30ss} from "./metaData30ss"
import {meta3ss} from "./metaData3ss"
import {ImageLayerService} from "./image-layer.service";

@Injectable({
  providedIn: 'root'
})
export class TileLayerService {

  public static readonly ID:string = "GHSL_ID";
  public static readonly RES:string = "GHSL_RES";
  public static readonly RES_3SS:string = "3ss";
  public static readonly RES_30SS:string = "30ss";

  //check:
  // https://openlayers.org/en/latest/examples/sea-level.html
  // https://stackoverflow.com/questions/57319221/how-to-create-custom-tiles-that-fit-on-a-certain-extent-openlayers5
  // https://gis.stackexchange.com/questions/344604/openlayers-smoothly-change-tile-source-on-zoom
  // https://gis.stackexchange.com/questions/234039/min-max-zoom-levels-for-a-tilelayer
  // LAZY loading: https://stackoverflow.com/questions/77428955/openlayer-on-zooming-map-image-filter-get-only-visible-areas-on-map

  polygonsArray: Polygon[]
  polygonsArray3ss: Polygon[]
  polygonsArray30ss: Polygon[]

  visiblePolygonsMap: Map<string, Polygon> = new Map ();

  constructor(private imageLayerService:ImageLayerService) {
    this.polygonsArray = this.getPolygons(TileLayerService.RES_30SS)
    this.polygonsArray3ss = this.getPolygons(TileLayerService.RES_3SS)
    this.polygonsArray30ss = this.getPolygons(TileLayerService.RES_30SS)
  }

  createTileLayer(map: OlMap) {
    this.mapTiler(map)
  }

  mapTiler (map: OlMap) {
    map.on('moveend', () => {
      const mapExtent =  map.getView().calculateExtent(map.getSize());
      const extent = transformExtent(mapExtent, 'EPSG:3857', 'EPSG:4326');
      const tl = getTopLeft(extent);
      const tr = getTopRight(extent);
      const bl = getBottomLeft(extent);
      const br = getBottomRight(extent);
      const mapViewPolygon = new Polygon([[tl, tr, br, bl, tl]]);
      const resolution = map.getView().getZoom()! > 11? TileLayerService.RES_3SS : TileLayerService.RES_30SS
      console.log(resolution)
      const tempVisiblePolygonsMap: Map<string, Polygon> = this.getViewPolygonsArray(resolution, mapViewPolygon);

      // ISSUE WITH POLYGON CLEANUP ON RESOLUTION CHANGE

      const toAddVisiblePolygonsMap: Map<string, Polygon> = this.mapDifference(tempVisiblePolygonsMap, this.visiblePolygonsMap)
      const toDeleteVisiblePolygonsMap: Map<string, Polygon> = this.mapDifference(this.visiblePolygonsMap, tempVisiblePolygonsMap)
      this.visiblePolygonsMap = new Map([...this.visiblePolygonsMap.entries(), ...toAddVisiblePolygonsMap.entries()])
      this.deleteFromMap(map, toDeleteVisiblePolygonsMap)
      this.addPolygonsToMap(map, toAddVisiblePolygonsMap)
    })
  }

  getViewPolygonsArray(resolution: string, mapViewPolygon:Polygon): Map<string, Polygon> {
    const tempVisiblePolygonsMap: Map<string, Polygon> = new Map ();
    const polygonsArray = (resolution === TileLayerService.RES_30SS? this.polygonsArray30ss : this.polygonsArray3ss)
    polygonsArray.forEach(layerPolygon => {
      const layerPolygonExtent = layerPolygon.getExtent()
      if (mapViewPolygon.intersectsExtent(layerPolygonExtent)) {
        tempVisiblePolygonsMap.set(layerPolygon.get(TileLayerService.ID), layerPolygon)
      }
    })
    return tempVisiblePolygonsMap;
  }

  getPolygons(resolution:string):Polygon[] {
    const polygons: Polygon[] = []
    const meta = (resolution === TileLayerService.RES_30SS? meta30ss : meta3ss)
    Object.keys(meta).forEach(function(key){
      const tl = meta[key].topLeftCorner
      const tr = meta[key].topRightCorner
      const bl = meta[key].bottomLeftCorner
      const br = meta[key].bottomRightCorner
      const polygon = new Polygon([[tl, tr, br, bl, tl]]);
      polygon.set(TileLayerService.ID, key)
      polygon.set(TileLayerService.RES, resolution)
      polygons.push(polygon);
    });
    return polygons
  }

  deleteFromMap(map:OlMap, polygonsMap: Map<string, Polygon>) {
    map.getLayers().forEach(layer => {
      if (layer && polygonsMap.has(layer.get(TileLayerService.ID))) {
        map.removeLayer(layer);
      }
    });
  }

  addPolygonsToMap(map:OlMap, polygonsMap: Map<string, Polygon>) {
    polygonsMap.forEach((value, key) => {
      let hasNoLayer: boolean = true;
      map.getLayers().forEach(layer => {
        if (polygonsMap.has(layer.get(TileLayerService.ID))) { //if we already have layer from map no need to add it again. Perhaps redundant check.
          hasNoLayer = false;
        }
      });
      if(hasNoLayer) {
        this.addPolygonToMap(map, value)
      }
    });
  }

  addPolygonToMap(map:OlMap, polygon:Polygon) {
    this.imageLayerService.addImageLayerFromPolygon(map, polygon)
  }

  mapDifference(map1: Map<string, Polygon>, map2: Map<string, Polygon>): Map<string, Polygon> {
    const difference = new Map<string, Polygon>();
    map1.forEach((value, key) => {
      if (!map2.has(key)) {
        difference.set(key, value);
      }
    });
    return difference;
  }

}
