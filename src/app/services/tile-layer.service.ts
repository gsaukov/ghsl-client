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

export enum GhslLayerResolution {
  RES_3SS = "3ss",
  RES_30SS = "30ss",
  RES_90SS ="90ss"
}

@Injectable({
  providedIn: 'root'
})
export class TileLayerService {

  public static readonly ID:string = "GHSL_ID";
  public static readonly RES:string = "GHSL_RES";

  public currentResolution!:GhslLayerResolution

  polygonsArray3ss: Polygon[]
  polygonsArray30ss: Polygon[]
  polygonsArray90ss: Polygon[]

  visiblePolygonsMap: Map<string, Polygon> = new Map ();
  visibleLayersMap: Map<string, Layer> = new Map ();

  constructor(private imageLayerService:ImageLayerService) {
    this.polygonsArray3ss = this.getPolygons(GhslLayerResolution.RES_3SS)
    this.polygonsArray30ss = this.getPolygons(GhslLayerResolution.RES_30SS)
    this.polygonsArray90ss = this.getPolygons(GhslLayerResolution.RES_90SS)
  }

  createTileLayer(map: OlMap) {
    this.mapTiler(map)
  }

  getVisibleLayers(): Map<string, Layer> {
    return this.visibleLayersMap
  }

  refreshVisibleLayer() {
    this.visibleLayersMap.forEach((value, key) => {
      this.visibleLayersMap.get(key)?.changed()
    });
  }

  private mapTiler (map: OlMap) {
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
      this.currentResolution = resolution;

      // CLEAN THIS!
      // Perhaps kill all refresh logic and properly attach unmanaged layer to the map in another promise.

      const toAddVisiblePolygonsMap: Map<string, Polygon> = this.mapDifference(tempVisiblePolygonsMap, this.visiblePolygonsMap)
      const toDeleteVisiblePolygonsMap: Map<string, Polygon> = this.mapDifference(this.visiblePolygonsMap, tempVisiblePolygonsMap)
      this.visiblePolygonsMap = new Map([...this.visiblePolygonsMap.entries(), ...toAddVisiblePolygonsMap.entries()])
      toDeleteVisiblePolygonsMap.forEach((value, key) => {this.visiblePolygonsMap.delete(key)});
      this.deleteFromMap(map, toDeleteVisiblePolygonsMap)
      this.addPolygonsToMap(map, toAddVisiblePolygonsMap)

      // Garbage collection and view tests :)
      // console.log("p size:" + this.visiblePolygonsMap.size + " l size: " + this.visiblePolygonsMap.size)
      // console.log(this.logKeys(this.visiblePolygonsMap))
    })

  }

  private getViewPolygonsArray(resolution: GhslLayerResolution, mapViewPolygon:Polygon): Map<string, Polygon> {
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

  private getPolygons(resolution:string):Polygon[] {
    const polygons: Polygon[] = []
    const meta = this.chooseMeta(resolution)
    Object.keys(meta).forEach(function(key){
      const tl = meta[key].topLeftCorner
      const br = meta[key].bottomRightCorner
      const tr = [tl[0],br[1]]
      const bl = [br[0],tl[1]]
      const polygon = new Polygon([[tl, tr, br, bl, tl]]);
      polygon.set(TileLayerService.ID, key)
      polygon.set(TileLayerService.RES, resolution)
      polygons.push(polygon);
    });
    return polygons
  }

  private deleteFromMap(map:OlMap, polygonsMap: Map<string, Polygon>) {
    polygonsMap.forEach((value, key) => {
      if (this.visibleLayersMap.has(key)) {
        this.visibleLayersMap.get(key)?.setMap(null)
        this.visibleLayersMap.delete(key)
      }
    });
  }

  private addPolygonsToMap(map:OlMap, polygonsMap: Map<string, Polygon>) {
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

  private addPolygonToMap(map:OlMap, polygon:Polygon) {
    const layer = this.imageLayerService.addImageLayerFromPolygon(map, polygon)
    this.visibleLayersMap.set(polygon.get(TileLayerService.ID), layer)
  }

  private mapDifference(map1: Map<string, Polygon>, map2: Map<string, Polygon>): Map<string, Polygon> {
    const difference = new Map<string, Polygon>();
    map1.forEach((value, key) => {
      if (!map2.has(key)) {
        difference.set(key, value);
      }
    });
    return difference;
  }

  private chooseResolution(zoom:number):GhslLayerResolution {
    if(zoom > 12) {
      return GhslLayerResolution.RES_3SS
    } else if (zoom > 6) {
      return GhslLayerResolution.RES_30SS
    } else {
      return GhslLayerResolution.RES_90SS
    }
  }

  private chooseMeta(resolution:string):any {
    if(resolution === GhslLayerResolution.RES_3SS) {
      return meta3ss
    } else if (resolution === GhslLayerResolution.RES_30SS) {
      return meta30ss
    } else {
      return meta90ss
    }
  }

  private choosePolygonArray(resolution:GhslLayerResolution):Polygon[] {
    if(resolution === GhslLayerResolution.RES_3SS) {
      return this.polygonsArray3ss
    } else if (resolution === GhslLayerResolution.RES_30SS) {
      return this.polygonsArray30ss
    } else {
      return this.polygonsArray90ss
    }
  }

  private logKeys(map: Map<string, Polygon>):string {
    let res = ''
    map.forEach((value, key) => {
      res = res + key + ' '
    });
    return res
  }
}
