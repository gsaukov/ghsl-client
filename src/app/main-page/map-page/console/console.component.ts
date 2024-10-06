import {AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import {IMAGE_FILE_PREFIX, LoadingLayer} from "../../../services/image-layer.service";
import {StatisticsService} from "../../../services/statistics.service";

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrl: './console.component.css'
})
export class ConsoleComponent implements AfterViewChecked {
  @ViewChild('logRecords', { static: false }) logRecords!: ElementRef;

  isConsoleOpen: boolean

  constructor(private statisticsService: StatisticsService,) {
    this.isConsoleOpen = false
  }

  getLayers(): LoadingLayer[] {
    return Array.from(this.statisticsService.loadingLayers.values());
  }

  getLayersCount(): number {
    return this.getLayers().filter(v => v.key.startsWith(IMAGE_FILE_PREFIX)).length;
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

  clearConsole() {
    this.statisticsService.clear()
  }

  enableVrs() {
    this.statisticsService.vrs = !this.statisticsService.vrs
  }

  copyToMemBuffer() {
    navigator.clipboard.writeText(JSON.stringify(this.getLayers())).then(() => {});
  }

  getVrsLabel() {
    return this.statisticsService.vrs?"vrs_off":"vrs_on";
  }
}
