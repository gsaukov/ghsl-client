import {Component, ViewChild} from '@angular/core';
import {ImageLayerService} from "../../../services/image-layer.service";
import {MatDrawer} from '@angular/material/sidenav';
import {GhslLayerResolution, TileLayerService} from "../../../services/tile-layer.service";
import { MatDialog } from '@angular/material/dialog';
import {AboutComponent} from "./about/about.component";
import { timer } from 'rxjs';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrl: './legend.component.css'
})
export class LegendComponent {
  @ViewChild('drawer') drawer!: MatDrawer;

  isLegendOpen:boolean = false;
  shakingAboutLinkClass: string = 'about-link shake-about-link';

  constructor(public imageLayerService: ImageLayerService, public tileLayerService: TileLayerService, public dialog: MatDialog) {
    this.openAboutDialog()
  }

  openAboutDialog(): void {
    const dialogRef = this.dialog.open(AboutComponent, {
      data: {},
      backdropClass: 'overlay-background'
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  toggle(){
    this.drawer.toggle()
    this.isLegendOpen = !this.isLegendOpen;
    //this will stop shaking about link after legend opened first time.
    timer(8000).subscribe(() => this.shakingAboutLinkClass = 'about-link');
  }

  getAreaResolution():string {
    if(this.tileLayerService.currentResolution === GhslLayerResolution.RES_3SS) {
      return '10000 m'
    } else {
      return '1 km'
    }
  }

  getPopulationDensity(densityRange:string):string {
    if(this.tileLayerService.currentResolution === GhslLayerResolution.RES_3SS) {
      switch (densityRange) {
        case '1-10': return '0.01-0.1'
        case '10-49': return '0.1-0.5'
        case '50-129': return '0.5-1.3'
        case '130-399': return '1.3-4'
        case '400-1k': return '4-10'
        case '1k-2k': return '10-20'
        case '2k-3.5k': return '20-35'
        case '3.5k-5.5k': return '35-55'
        case '5.5k-7.5k': return '55-75'
        case '7.5k-10k': return '75-100'
        case '10k-12k': return '100-120'
        case '12k-16k': return '120-160'
        case '16k-22k': return '160-220'
        case '22k-30k': return '220-300'
        case '30k-50k': return '300-500'
        case '50k-100k': return '500-1k'
        case '100k-200k': return '1k-2k'
        case '200k+': return '2k+'
        default: throw Error('population density not found')
      }
    } else {
      return densityRange
    }
  }
}
