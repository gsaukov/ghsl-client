import {Injectable} from '@angular/core';
import ImageStatic from "ol/source/ImageStatic";
import ImageLayer from "ol/layer/Image";
import {get} from "ol/proj";
import {Polygon} from "ol/geom";
import {TileLayerService} from "./tile-layer.service";
import {Extent} from "ol/extent";
import OlMap from "ol/Map";
import { timer } from 'rxjs';

export interface LoadingLayer {
  key: string;
  timeMs?: number;
  loaded: boolean;
  error: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  loadingLayers: Map<string, LoadingLayer> = new Map();
  vrs:boolean //view rendering statistics
  constructor() {
    this.vrs = false
  }

  addStatisticLoadingLayer(statisticsLoadingLayer: LoadingLayer){
    this.loadingLayers.set(statisticsLoadingLayer.key, statisticsLoadingLayer)
    this.removeFromStatisticsWithDelay(statisticsLoadingLayer);
  }

  clear() {
    this.loadingLayers.clear()
  }

  removeFromStatisticsWithDelay(loadingLayer: LoadingLayer) {
    timer(60000).subscribe(() => this.loadingLayers.delete(loadingLayer.key));
  }
}


