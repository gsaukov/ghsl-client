import {AfterViewInit, Component, Renderer2, ViewChild} from '@angular/core';
import {TileLayerService} from "../../../services/tile-layer.service";
import {MatSlider, MatSliderDragEvent, MatSliderThumb} from "@angular/material/slider";
import {ImageLayerService} from "../../../services/image-layer.service";
import {MapService} from "../../../services/map.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent implements AfterViewInit{

  @ViewChild(MatSlider) slider!: MatSlider;
  @ViewChild(MatSliderThumb) thumb!: MatSliderThumb;

  constructor(private mapService: MapService, private tileLayerService: TileLayerService,
              private renderer: Renderer2, public imageLayerService: ImageLayerService) {
  }

  ngAfterViewInit(): void {
    this.formatLabel()
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

  setDarkMode(isDarkMode: boolean) {
    if(isDarkMode) {
      this.mapService.setDarkBaseLayer()
    } else {
      this.mapService.setDefaultBaseLayer()
    }
  }

  formatLabel() {
    if(this.thumb) {
      const knob = this.slider._getThumb(1)._hostElement.getElementsByClassName('mdc-slider__thumb-knob')[0]
      this.renderer.setProperty(knob, 'textContent', Math.round(this.thumb.value * 100));
    }
  }

}
