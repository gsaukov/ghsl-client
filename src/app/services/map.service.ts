import {Injectable} from '@angular/core';
import Map from "ol/Map";
import View from "ol/View";
import {fromLonLat} from "ol/proj";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import {Observable} from "rxjs";
import {ScaleLine, defaults} from "ol/control";
import {TileLayerService} from "./tile-layer.service";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map!: Map;

  constructor(private tileLayerService:TileLayerService) {
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
            visible: true
          }),
          // this.getDefaultVectorLayer()
        ],
        target: 'ol-map',
      });
      this.getGhslVectorLayer(map)
      observer.next(this.map = map);
      observer.complete();
    })
  }

  getMap(): Map {
    return this.map;
  }

  getGhslVectorLayer(map: Map) {
    // this.imageLayerService.addImageLayerFromExtentAndUrl(map, [9.992083316153526, 29.099583419121316, 19.992083276545834, 59.09958329838346], 'https://localhost:4200/assets/concatenated.png');
    this.tileLayerService.createTileLayer(map);
  }

}
