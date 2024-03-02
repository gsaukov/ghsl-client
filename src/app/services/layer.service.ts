import {Injectable} from '@angular/core';
import {Feature} from "ol";
import VectorSource from 'ol/source/Vector';
import {Vector} from "ol/layer";
import {Fill, Stroke, Style} from "ol/style";

@Injectable({
  providedIn: 'root'
})
export class LayerService {

  createLayer(feaures:Feature[]) {
    const vectorLayer = new Vector({
      source: new VectorSource({
        features: feaures
      }),
    });
    return vectorLayer;
  }

  getStyle(num:number) {
    let color
    if(num < 10) {
      color = 'rgba(0, 0, 255, 0.05)'
    } else if (num < 50) {
      color = 'rgba(0, 0, 255, 0.1)'
    } else if (num < 100) {
      color = 'rgba(0, 0, 255, 0.15)'
    } else if (num < 200) {
      color = 'rgba(0, 0, 255, 0.20)'
    } else if (num < 1000) {
      color = 'rgba(0, 0, 255, 0.30)'
    } else if (num < 5000) {
      color = 'rgba(0, 0, 255, 0.40)'
    }else if (num > 5000) {
      color = 'rgba(0, 0, 255, 0.60)'
    }
    return new Style({
      fill: new Fill({
        color: color
      }),
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0)'
      })
    });
  }

}
