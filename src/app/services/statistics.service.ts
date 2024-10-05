import {Injectable} from '@angular/core';
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

  addStatisticsViewRendering(view:number[], tileNumber:number, timeMs:number) {
    //view - [tl[0],br[1], br[0],tl[1]]
    const key = `S_${tileNumber}_V_
    ${view[0].toFixed(6)},${view[1].toFixed(6)};
    ${view[2].toFixed(6)},${view[3].toFixed(6)}`
    this.addStatisticLoadingLayer({key: key, timeMs: timeMs, loaded: true, error: false})
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


