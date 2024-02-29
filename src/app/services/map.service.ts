import {Injectable} from '@angular/core';
import Map from "ol/Map";
import View from "ol/View";
import {fromLonLat} from "ol/proj";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import {Observable} from "rxjs";
import {ScaleLine, defaults} from "ol/control";
import GeoJSON from 'ol/format/GeoJSON';
import Layer from 'ol/layer/Layer';
import VectorSource from 'ol/source/Vector';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer';

const style = {
  'stroke-color': ['*', ['get', 'COLOR'], [220, 220, 220]],
  'stroke-width': 2,
  'stroke-offset': -1,
  'fill-color': ['*', ['get', 'COLOR'], [255, 255, 255, 0.6]],
};

class WebGLLayer extends Layer {
  // @ts-ignore
  createRenderer() {
    return new WebGLVectorLayerRenderer(this, {
      style,
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map!: Map;

  constructor() {
  }

  buildMap(): Observable<Map> {
    const osm = new TileLayer({
      source: new OSM(),
    });

    return new Observable((observer) => {
      const map = new Map({
        controls: defaults().extend([new ScaleLine({
          units: 'metric',
        })]),
        view: new View({
          center: fromLonLat([69.2787079, 41.3123363], 'EPSG:3857'),
          zoom: 12,
        }),
        layers: [
          new TileLayer({
            source: new OSM({
              attributions: '<a href="https://gsaukov.netlify.app/" target="_blank" style="color:blue;">Georgy Saukov</a> &copy; ' +
                '<a href="https://www.openstreetmap.org/copyright" target="_blank" style="color:blue;">OpenStreetMap</a> contributors',
            }),
          }),
          this.getDefaultVectorLayer()
        ],
        target: 'ol-map',
      });
      observer.next(this.map = map);
      observer.complete();
    });
  }

  getMap(): Map {
    return this.map;
  }

  getDefaultVectorLayer() {
    const vectorLayer = new WebGLLayer({
      source: new VectorSource({
        url: 'https://openlayers.org/data/vector/ecoregions.json',
        format: new GeoJSON(),
      }),
    });
    return vectorLayer
  }

}
