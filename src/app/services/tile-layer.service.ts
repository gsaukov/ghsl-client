import {Injectable} from '@angular/core';
import OlMap from "ol/Map";
import {transformExtent} from "ol/proj";
import {Polygon} from "ol/geom";
import {getBottomLeft, getBottomRight, getTopLeft, getTopRight} from "ol/extent"
import {meta30ss} from "./metaData30ss"
import {ImageLayerService} from "./image-layer.service";

@Injectable({
  providedIn: 'root'
})
export class TileLayerService {

  public static ID:string = "GHSL_ID";

  //check:
  // https://openlayers.org/en/latest/examples/sea-level.html
  // https://stackoverflow.com/questions/57319221/how-to-create-custom-tiles-that-fit-on-a-certain-extent-openlayers5
  // https://gis.stackexchange.com/questions/344604/openlayers-smoothly-change-tile-source-on-zoom
  // https://gis.stackexchange.com/questions/234039/min-max-zoom-levels-for-a-tilelayer
  // LAZY loading: https://stackoverflow.com/questions/77428955/openlayer-on-zooming-map-image-filter-get-only-visible-areas-on-map

  polygonsArray: Polygon[]

  visiblePolygonsMap: Map<string, Polygon> = new Map ();

  constructor(private imageLayerService:ImageLayerService) {
    this.polygonsArray = this.getPolygons()
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

      const tempVisiblePolygonsMap: Map<string, Polygon> = new Map ();
      this.polygonsArray.forEach(layerPolygon => {
        const layerPolygonExtent = layerPolygon.getExtent()
        if (mapViewPolygon.intersectsExtent(layerPolygonExtent)) {
          tempVisiblePolygonsMap.set(layerPolygon.get(TileLayerService.ID), layerPolygon)
        }
      })
      const toAddVisiblePolygonsMap: Map<string, Polygon> = this.mapDifference(tempVisiblePolygonsMap, this.visiblePolygonsMap)
      const toDeleteVisiblePolygonsMap: Map<string, Polygon> = this.mapDifference(this.visiblePolygonsMap, tempVisiblePolygonsMap)
      this.visiblePolygonsMap = new Map([...this.visiblePolygonsMap.entries(), ...toAddVisiblePolygonsMap.entries()])
      this.deleteFromMap(map, toDeleteVisiblePolygonsMap)
      this.addPolygonsToMap(map, toAddVisiblePolygonsMap)
    })
  }

  getPolygons():Polygon[] {
    const polygons: Polygon[] = []
    Object.keys(meta30ss).forEach(function(key){
      const tl = meta30ss[key].topLeftCorner
      const tr = meta30ss[key].topRightCorner
      const bl = meta30ss[key].bottomLeftCorner
      const br = meta30ss[key].bottomRightCorner
      const polygon = new Polygon([[tl, tr, br, bl, tl]]);
      polygon.set(TileLayerService.ID, key)
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
    const imageTile = this.imageLayerService.createImageLayer(polygon)
    map.addLayer(imageTile)
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
