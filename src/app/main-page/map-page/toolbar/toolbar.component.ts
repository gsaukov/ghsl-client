import { Component } from '@angular/core';
import {TileLayerService} from "../../../services/tile-layer.service";
import {MatSliderDragEvent} from "@angular/material/slider";
import {ImageLayerService} from "../../../services/image-layer.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {

  constructor(private tileLayerService: TileLayerService, public imageLayerService: ImageLayerService) {
  }

  applyOpacity(event: MatSliderDragEvent) {
    this.imageLayerService.setOpacity(event.value)
    this.tileLayerService.getVisibleLayers().forEach((value, key) => {
      value.setOpacity(event.value)
    });
    this.tileLayerService.refreshVisibleLayer()
  }

  applyInterpolation(interpolate:boolean) {
    this.imageLayerService.setInterpolate(interpolate)
    this.tileLayerService.getVisibleLayers().forEach((value, key) => {
      const source = value.getSource()
      if(source) {
        source['interpolate_'] = interpolate
        source.changed()
      }
    });
  }

}
