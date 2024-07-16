import {Injectable} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {AboutComponent} from "../main-page/map-page/about/about.component";
import {ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog, private router: Router, private route: ActivatedRoute) {
  }

  openAboutDialog(): void {
    const dialogRef = this.dialog.open(AboutComponent, {
      data: {},
      backdropClass: 'overlay-background'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }
}
