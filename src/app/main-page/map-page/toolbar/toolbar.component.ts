import { Component } from '@angular/core';
import {TileLayerService} from "../../../services/tile-layer.service";
import {MatSliderDragEvent} from "@angular/material/slider";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {

  constructor(private tileLayerService: TileLayerService) {
  }

  applyOpacity(event: MatSliderDragEvent) {
    this.tileLayerService.getVisibleLayers().forEach((value, key) => {
      value.setOpacity(event.value)
    });
  }

}
