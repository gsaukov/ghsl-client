import {Injectable} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {AboutComponent} from "../main-page/map-page/about/about.component";

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) {
  }

  openAboutDialog(): void {
    const dialogRef = this.dialog.open(AboutComponent, {
      data: {},
      backdropClass: 'overlay-background'
    });
    dialogRef.afterClosed().subscribe(result => {});
  }
}

