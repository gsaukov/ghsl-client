import {Component, OnInit} from '@angular/core';
import {MapService} from "../../services/map.service";
import Map from 'ol/Map';

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrl: './map-page.component.css'
})
export class MapPageComponent implements OnInit {

  private _map!: Map;

  constructor(private mapService: MapService) {
  }

  ngOnInit(): void {
    if (!this._map) {
      this.mapService.build().subscribe(map => {
        this._map = map
      });
    }
  }

  get map(): Map {
    return this._map;
  }
}
