import {Injectable} from '@angular/core';
import ImageStatic from "ol/source/ImageStatic";
import ImageLayer from "ol/layer/Image";
import {get} from "ol/proj";
import {Polygon} from "ol/geom";
import {TileLayerService} from "./tile-layer.service";
import {Extent} from "ol/extent";
import OlMap from "ol/Map";
import { timer } from 'rxjs';

// An array of numbers representing an extent: [minx, miny, maxx, maxy].
// let extent = [9.992083316153526, 39.099583378875366, 19.992083276545834, 49.09958333862941]
// let extent = [9.992083316153526, 29.099583419121316, 19.992083276545834, 59.09958329838346]

const IMAGE_FILE_PREFIX = 'GHS_POP_E2025_GLOBE_R2023A_4326_'


export interface LoadingLayer {
  key: string;
  timeMs?: number;
  loaded: boolean;
  error: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ImageLayerService {
  loadingLayers: Map<string, LoadingLayer>
  opacity:number
  interpolate:boolean // when false displays pixels and true do smooth/blurs images on zoom.

  constructor() {
    this.opacity = 0.65
    this.interpolate = false
    this.loadingLayers = new Map()
  }

  addImageLayerFromPolygon(map:OlMap, polygon: Polygon): ImageLayer<ImageStatic> {
    const extent = polygon.getExtent()
    const key = `${IMAGE_FILE_PREFIX}${polygon.get(TileLayerService.ID)}`
    const url = `https://raw.githubusercontent.com/gsaukov/ghsl-data/main/assets/${polygon.get(TileLayerService.RES)}/${key}.png`
    return this.addImageLayerFromExtentAndUrl(map, extent, url, key);
  }

  addImageLayerFromExtentAndUrl(map:OlMap, extent: Extent, url: string, key: string): ImageLayer<ImageStatic> {
    let projection = get('EPSG:4326')!
    const imageLoadFunctionWrapper = (image: any, src: any) => {
      const loadingLayer = this.imageLoadingFunction(image, src, key, this.loadingLayers);
      this.loadingLayers.set(loadingLayer.key, loadingLayer)
    };
    let imageStatic = new ImageStatic({
      url: url,
      imageExtent: extent,
      attributions: 'none',
      projection: projection,
      interpolate: this.interpolate,
      imageLoadFunction: imageLoadFunctionWrapper,
    })
    // static image
    let imageLayer = new ImageLayer({
      source: imageStatic,
      className: 'ghsl-image',
      opacity: this.opacity,
      visible: true,
      map: map
    });
    return imageLayer;
  }

  setOpacity(opacity:number) {
    this.opacity = opacity
  }

  setInterpolate(interpolate:boolean) {
    this.interpolate = interpolate
  }

  imageLoadingFunction(image: any, src: any, key: string, loadingLayers:Map<string, LoadingLayer>):LoadingLayer {
    const execTime = new Date().getTime();
    const loadingLayer:LoadingLayer = {key: key, loaded:false, error:false}
    const loadingImage = image.getImage()
    loadingImage.src = src;
    loadingImage.onload = function(){
      loadingLayer.loaded = true;
      loadingLayer.timeMs = new Date().getTime() - execTime
      removeFromLoadingLayersWithDelay(loadingLayer, loadingLayers)
    }
    loadingImage.onerror = function () {
      loadingLayer.loaded = true;
      loadingLayer.error = true;
      removeFromLoadingLayersWithDelay(loadingLayer, loadingLayers)
    }
    return loadingLayer;
  }

  clearLoadingLayers() {
    this.loadingLayers.clear()
  }
}

function removeFromLoadingLayersWithDelay(loadingLayer: LoadingLayer, loadingLayers: Map<string, LoadingLayer>) {
  timer(60000).subscribe(() => loadingLayers.delete(loadingLayer.key));
}
