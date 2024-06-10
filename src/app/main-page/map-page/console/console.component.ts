import {AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import {ImageLayerService, LoadingLayer} from "../../../services/image-layer.service";

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrl: './console.component.css'
})
export class ConsoleComponent implements AfterViewChecked {
  @ViewChild('logRecords', { static: false }) logRecords!: ElementRef;

  isConsoleOpen: boolean
  loadingLayers: LoadingLayer[]

  constructor(private imageLayerService: ImageLayerService) {
    this.loadingLayers = []
    this.isConsoleOpen = false
  }

  getLayers(): LoadingLayer[] {
    this.loadingLayers = Array.from(this.imageLayerService.loadingLayers.values());
    return this.loadingLayers;
  }

  ngAfterViewChecked() {
    if(this.logRecords) {
      //move scroll to bottom
      this.logRecords.nativeElement.scrollTop = this.logRecords.nativeElement.scrollHeight;
    }
  }

  openConsole() {
    this.isConsoleOpen = !this.isConsoleOpen
  }
}
