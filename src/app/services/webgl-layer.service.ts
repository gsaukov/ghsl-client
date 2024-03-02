import {Injectable} from '@angular/core';
import GeoJSON from 'ol/format/GeoJSON';
import Layer from 'ol/layer/Layer';
import VectorSource from 'ol/source/Vector';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer';
import {Feature} from "ol";

const style = {
  'stroke-color': ['*', ['get', 'COLOR'], [0, 0, 0, 0]],
  'stroke-width': 0,
  'stroke-offset': 0,
  'fill-color': ['*', ['get', 'COLOR'], [255, 255, 255, 0.6]],
};

export class WebGLLayer extends Layer {
  // @ts-ignore
  createRenderer() {
    return new WebGLVectorLayerRenderer(this, {style});
  }
}

@Injectable({
  providedIn: 'root'
})
export class WebGLLayerService {

  getDefaultVectorLayer() {
    const vectorLayer = new WebGLLayer({
      source: new VectorSource({
        url: 'https://openlayers.org/data/vector/ecoregions.json',
        format: new GeoJSON(),
      }),
    });
    return vectorLayer
  }

  createLayer(feaures:Feature[]) {
    const vectorLayer = new WebGLLayer({
      source: new VectorSource({
        features: feaures
      }),
    });
    return vectorLayer;
  }

}
