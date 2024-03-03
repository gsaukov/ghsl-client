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
import {Fill, Stroke, Style} from "ol/style";
import {Feature} from "ol";
import {Polygon} from 'ol/geom';
import {DataService} from "./data.service";
import {CalculationService} from "./calculation.service";
import {LayerService} from "./layer.service";
import {WebGLLayer, WebGLLayerService} from "./webgl-layer.service";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map!: Map;

  constructor(private dataService: DataService, private calculationService: CalculationService,
              private layerService: LayerService, private webglLayerService: WebGLLayerService) {
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
          center: fromLonLat([10.40041664, 48.77458333], 'EPSG:3857'),
          zoom: 12,
        }),
        layers: [
          new TileLayer({
            source: new OSM({
              attributions: '<a href="https://gsaukov.netlify.app/" target="_blank" style="color:blue;">Georgy Saukov</a> &copy; ' +
                '<a href="https://www.openstreetmap.org/copyright" target="_blank" style="color:blue;">OpenStreetMap</a> contributors',
            }),
          }),
          // this.getDefaultVectorLayer()
        ],
        target: 'ol-map',
      });
      this.getGhslVectorLayer()
      observer.next(this.map = map);
      observer.complete();
    });
  }

  getMap(): Map {
    return this.map;
  }

  getGhslVectorLayer() {
    this.dataService.getData('GHS_POP_E2025_GLOBE_R2023A_4326_30ss_V1_0_R5_C20_int.json').subscribe(
      res => {
        const layer = this.webglLayerService.createLayer(this.calculationService.loadTurfJSON(res))
        this.map.addLayer(layer);
      }
    )
  }

}
