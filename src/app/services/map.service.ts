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

const style = {
  'stroke-color': ['*', ['get', 'COLOR'], [0, 0, 0, 0]],
  'stroke-width': 0,
  'stroke-offset': 0,
  'fill-color': ['*', ['get', 'COLOR'], [255, 255, 255, 0.6]],
};

class WebGLLayer extends Layer {
  // @ts-ignore
  createRenderer() {
    return new WebGLVectorLayerRenderer(this, {style});
  }
}

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map!: Map;

  constructor(private dataService:DataService, private calculationService:CalculationService) {
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

  getDefaultVectorLayer() {
    const vectorLayer = new WebGLLayer({
      source: new VectorSource({
        url: 'https://openlayers.org/data/vector/ecoregions.json',
        format: new GeoJSON(),
      }),
    });
    return vectorLayer
  }

  getGhslVectorLayer() {
    this.dataService.getData('GHS_POP_E2025_GLOBE_R2023A_4326_30ss_V1_0_R5_C20_int.json').subscribe(
      res => {
        // const layer = this.loadJSON(res)
        const layer = this.createLayer(this.calculationService.loadTurfJSON(res))
        // console.log(layer)
        this.map.addLayer(layer);
      }
    )
  }

  loadJSON(response:any): WebGLLayer  {
    var jsonObject = JSON.parse(response);

    const top = jsonObject.metaData.topLeftCorner[0]; // lon
    const left = jsonObject.metaData.topLeftCorner[1]; // lat
    const bottom = jsonObject.metaData.bottomRightCorner[0]; // lon
    const right = jsonObject.metaData.bottomRightCorner[1]; // lat
    const height = jsonObject.metaData.pixelHeightDegrees;
    const width = jsonObject.metaData.pixelWidthDegrees;
    const rows = jsonObject.metaData.areaWidth
    const cols = jsonObject.metaData.areaHeight
    const data = jsonObject.data.res
    const squares: Feature[] = []
    let olCenter

    const center = [top, left];
    olCenter = fromLonLat(center);

    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 50; j++) {
        const pixel = data[(i * cols) + j]
        if (pixel > 0) {
          let verticalPos = top + (j * height);
          let hotizontalPos = left - (i * width);
          const leftTop = [verticalPos, hotizontalPos];

          // Create a square feature
          const squareFeature = new Feature({
            geometry: new Polygon([[
              fromLonLat([leftTop[0], leftTop[1]]),
              fromLonLat([leftTop[0], leftTop[1] - height]),
              fromLonLat([leftTop[0] + width, leftTop[1] - height]),
              fromLonLat([leftTop[0] + width, leftTop[1]]),
              fromLonLat([leftTop[0], leftTop[1]]),
            ]])
          });
          squareFeature.setProperties({
            "COLOR": "#C48832",
          })
          // squareFeature.setStyle(this.getStyle(pixel));
          squares.push(squareFeature)
        }
      }
    }
    return this.createLayer(squares);
  }

  createLayer(feaures:Feature[]) {
    const vectorLayer = new WebGLLayer({
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
    } else if (num < 300) {
      color = 'rgba(0, 0, 255, 0.25)'
    } else if (num < 500) {
      color = 'rgba(0, 0, 255, 0.30)'
    } else if (num < 1000) {
      color = 'rgba(0, 0, 255, 0.40)'
    } else if (num < 5000) {
      color = 'rgba(0, 0, 255, 0.50)'
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
