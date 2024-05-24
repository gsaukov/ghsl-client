import {Injectable} from '@angular/core';
import Map from "ol/Map";
import View from "ol/View";
import {fromLonLat} from "ol/proj";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import {mergeMap, Observable, of} from "rxjs";
import {ScaleLine, defaults} from "ol/control";
import {TileLayerService} from "./tile-layer.service";
import Tile from 'ol/layer/Tile';
import StadiaMaps from 'ol/source/StadiaMaps';

const DEFAULT_COORDINATE: number[] = [10.40041664, 48.77458333]
const DEFAULT_ZOOM = 8

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map!: Map;

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
      const attributions = '<a href="https://gsaukov.netlify.app/" target="_blank" style="color:blue;">Georgy Saukov</a> ' +
          '| <a href="https://human-settlement.emergency.copernicus.eu/download.php?ds=pop" target="_blank" style="color:blue;">GHSL Data</a> ' +
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" style="color:blue;">OpenStreetMap</a> contributors'

      const defaultLayer = new TileLayer({
        source: new OSM({
          attributions: attributions
        }),
        visible: true
      })

      const stadiaMaps = new StadiaMaps({
        layer: 'alidade_smooth_dark',
        retina: true,
        // apiKey: 'OPTIONAL'
      })

      stadiaMaps.setAttributions(attributions)

      const darkLayer = new TileLayer({
        source: stadiaMaps,
        visible: true
      })

      const map = new Map({
        controls: defaults().extend([new ScaleLine({
          units: 'metric',
        })]),
        view: new View({
          center: fromLonLat(DEFAULT_COORDINATE, 'EPSG:3857'),
          zoom: DEFAULT_ZOOM,
        }),
        layers: [
          darkLayer
        ],
        target: 'ol-map',
      });
      this.map = map
      observer.next(map)
    })
  }

  applyGhslVectorLayer(map: Map) {
    this.tileLayerService.createTileLayer(map);
  }

  getMap(): Map {
    return this.map;
  }

}
