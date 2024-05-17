import {Injectable} from '@angular/core';
import Map from "ol/Map";
import View from "ol/View";
import {fromLonLat} from "ol/proj";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import {mergeMap, Observable, of} from "rxjs";
import {ScaleLine, defaults} from "ol/control";
import {TileLayerService} from "./tile-layer.service";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map!: Map;

  constructor(private tileLayerService:TileLayerService) {
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
          center: fromLonLat([10.40041664, 48.77458333], 'EPSG:3857'),
          zoom: 12,
        }),
        layers: [
          new TileLayer({
            source: new OSM({
              attributions: '<a href="https://gsaukov.netlify.app/" target="_blank" style="color:blue;">Georgy Saukov</a> ' +
                '| <a href="https://human-settlement.emergency.copernicus.eu/download.php?ds=pop" target="_blank" style="color:blue;">GHSL Data</a> ' +
                '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" style="color:blue;">OpenStreetMap</a> contributors',
            }),
            visible: true
          }),
        ],
        target: 'ol-map',
      });
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
