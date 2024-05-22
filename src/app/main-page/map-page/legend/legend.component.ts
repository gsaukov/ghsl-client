import { Component } from '@angular/core';
import {ImageLayerService} from "../../../services/image-layer.service";

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrl: './legend.component.css'
})
export class LegendComponent {
  showFiller = false;

  constructor(public imageLayerService: ImageLayerService) {
  }
}
