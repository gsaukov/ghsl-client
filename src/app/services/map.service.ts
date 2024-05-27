import {Injectable} from '@angular/core';
import Map from "ol/Map";
import View from "ol/View";
import {fromLonLat} from "ol/proj";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import {mergeMap, Observable, of} from "rxjs";
import {ScaleLine, defaults} from "ol/control";
import {TileLayerService} from "./tile-layer.service";

const DEFAULT_COORDINATE: number[] = [10.40041664, 48.77458333]
const DEFAULT_ZOOM = 8
const DEFAULT_OSM_MAP = 'default-osm-map'
const DARK_OSM_MAP = 'dark-osm-map'

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map!: Map;
  private defaultLayer: TileLayer<OSM>;

  constructor(private tileLayerService:TileLayerService) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const view = new View({
          center: fromLonLat([position.coords.longitude, position.coords.latitude]),
          zoom: DEFAULT_ZOOM
        });
        this.map.setView(view)
        },
        () => {},
        {timeout:10000})
    }

    const attributions = '<a href="https://gsaukov.netlify.app/" target="_blank" style="color:blue;">Georgy Saukov</a> ' +
      '| <a href="https://human-settlement.emergency.copernicus.eu/download.php?ds=pop" target="_blank" style="color:blue;">GHSL Data</a> ' +
      '<br>' +
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" style="color:blue;">OpenStreetMap</a> contributors'

    this.defaultLayer = new TileLayer({
      source: new OSM({
        attributions: attributions,
      }),
      className: DEFAULT_OSM_MAP,
      visible: true,
    })
  }

  build(): Observable<Map> {
    return this.buildMap().pipe(
      mergeMap((map) => {
        this.applyGhslVectorLayer(map)
        return of(map)
      })
    )
  }

  buildMap(): Observable<Map> {
    return new Observable((observer) => {
      const map = new Map({
        controls: defaults().extend([new ScaleLine({
          units: 'metric',
        })]),
        view: new View({
          center: fromLonLat(DEFAULT_COORDINATE, 'EPSG:3857'),
          zoom: DEFAULT_ZOOM,
        }),
        layers: [
          this.defaultLayer
        ],
        target: 'ol-map',
      });
      this.map = map
      observer.next(map)
    })
  }

  setDarkBaseLayer() {
    const mapLayer: Element = document.getElementsByClassName(DEFAULT_OSM_MAP)[0];
    //filter: grayscale(80%) invert(100%) hue-rotate(180deg)
    mapLayer.className = DARK_OSM_MAP
  }

  setDefaultBaseLayer() {
    const mapLayer: Element = document.getElementsByClassName(DARK_OSM_MAP)[0];
    mapLayer.className = DEFAULT_OSM_MAP
  }

  applyGhslVectorLayer(map: Map) {
    this.tileLayerService.createTileLayer(map);
  }

  getMap(): Map {
    return this.map;
  }

}
