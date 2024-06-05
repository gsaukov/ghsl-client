import { Component } from '@angular/core';
import {ImageLayerService, LoadingLayer} from "../../../services/image-layer.service";

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrl: './console.component.css'
})
export class ConsoleComponent {
  loadingLayers: LoadingLayer[]

  constructor(private imageLayerService: ImageLayerService) {
    this.loadingLayers = []
  }

  getLayers(): LoadingLayer[] {
    this.loadingLayers = Array.from(this.imageLayerService.loadingLayers.values());
    return this.loadingLayers;
  }

  protected readonly JSON = JSON;
}
