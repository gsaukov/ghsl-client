import {Injectable} from '@angular/core';
import OlMap from "ol/Map";
import {transformExtent} from "ol/proj";
import {Polygon} from "ol/geom";
import {getBottomLeft, getBottomRight, getTopLeft, getTopRight} from "ol/extent"
import {meta90ss} from "./metaData90ss"
import {meta30ss} from "./metaData30ss"
import {meta3ss} from "./metaData3ss"
import {ImageLayerService} from "./image-layer.service";
import Layer from "ol/layer/Layer";

@Injectable({
  providedIn: 'root'
})
export class TileLayerService {

  public static readonly ID:string = "GHSL_ID";
  public static readonly RES:string = "GHSL_RES";
  public static readonly RES_3SS:string = "3ss";
  public static readonly RES_30SS:string = "30ss";
  public static readonly RES_90SS:string = "90ss";

  polygonsArray3ss: Polygon[]
  polygonsArray30ss: Polygon[]
  polygonsArray90ss: Polygon[]

  visiblePolygonsMap: Map<string, Polygon> = new Map ();
  visibleLayersMap: Map<string, Layer> = new Map ();

  constructor(private imageLayerService:ImageLayerService) {
    this.polygonsArray3ss = this.getPolygons(TileLayerService.RES_3SS)
    this.polygonsArray30ss = this.getPolygons(TileLayerService.RES_30SS)
    this.polygonsArray90ss = this.getPolygons(TileLayerService.RES_90SS)
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
      const resolution = this.chooseResolution(map.getView().getZoom()!)
      const tempVisiblePolygonsMap: Map<string, Polygon> = this.getViewPolygonsArray(resolution, mapViewPolygon);

      // CLEAN THIS! KILL visiblePolygonsMap and work with visibleLayersMap
      // Perhaps kill all refresh logic and properly attach unmanaged layer to the map in another promise.

      const toAddVisiblePolygonsMap: Map<string, Polygon> = this.mapDifference(tempVisiblePolygonsMap, this.visiblePolygonsMap)
      const toDeleteVisiblePolygonsMap: Map<string, Polygon> = this.mapDifference(this.visiblePolygonsMap, tempVisiblePolygonsMap)
      this.visiblePolygonsMap = new Map([...this.visiblePolygonsMap.entries(), ...toAddVisiblePolygonsMap.entries()])
      toDeleteVisiblePolygonsMap.forEach((value, key) => {this.visiblePolygonsMap.delete(key)});
      this.deleteFromMap(map, toDeleteVisiblePolygonsMap)
      this.addPolygonsToMap(map, toAddVisiblePolygonsMap)
      this.refreshVisibleLayer()
      console.log(resolution)
    })

  }

  getViewPolygonsArray(resolution: string, mapViewPolygon:Polygon): Map<string, Polygon> {
    const tempVisiblePolygonsMap: Map<string, Polygon> = new Map ();
    const polygonsArray = this.choosePolygonArray(resolution)
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
    const meta = this.chooseMeta(resolution)
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
    polygonsMap.forEach((value, key) => {
      if (this.visibleLayersMap.has(key)) {
        this.visibleLayersMap.get(key)?.setMap(null)
        this.visibleLayersMap.delete(key)
      }
    });
  }

  refreshVisibleLayer() {
    this.visibleLayersMap.forEach((value, key) => {
        this.visibleLayersMap.get(key)?.changed()
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
    const layer = this.imageLayerService.addImageLayerFromPolygon(map, polygon)
    this.visibleLayersMap.set(polygon.get(TileLayerService.ID), layer)
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

  chooseResolution(zoom:number):string {
    if(zoom > 12) {
      return TileLayerService.RES_3SS
    } else if (zoom > 6) {
      return TileLayerService.RES_30SS
    } else {
      return TileLayerService.RES_90SS
    }
  }

  chooseMeta(resolution:string):any {
    if(resolution === TileLayerService.RES_3SS) {
      return meta3ss
    } else if (resolution === TileLayerService.RES_30SS) {
      return meta30ss
    } else {
      return meta90ss
    }
  }

  choosePolygonArray(resolution:string):Polygon[] {
    if(resolution === TileLayerService.RES_3SS) {
      return this.polygonsArray3ss
    } else if (resolution === TileLayerService.RES_30SS) {
      return this.polygonsArray30ss
    } else {
      return this.polygonsArray90ss
    }
  }

  logKeys(map1: Map<string, Polygon>):string {
    let res = ''
    map1.forEach((value, key) => {
      res = res + key + ' '
    });
    return res
  }
}
