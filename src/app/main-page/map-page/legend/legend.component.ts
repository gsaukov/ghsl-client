import { Component, ViewChild } from '@angular/core';
import {ImageLayerService} from "../../../services/image-layer.service";
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrl: './legend.component.css'
})
export class LegendComponent {
  @ViewChild('drawer') drawer!: MatDrawer;

  isLegendOpen:boolean = false;

  constructor(public imageLayerService: ImageLayerService) {
  }

  toggle(){
    this.drawer.toggle()
    this.isLegendOpen = !this.isLegendOpen;
  }
}
