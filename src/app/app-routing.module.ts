import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainPageComponent} from "./main-page/main-page.component";
import {MapPageComponent} from "./main-page/map-page/map-page.component";
import {AboutComponent} from "./main-page/map-page/about/about.component";
import {DialogService} from "./services/dialog.service";
import { inject } from '@angular/core'

const routes: Routes = [
  {
    path: '', component: MainPageComponent, children: [
      {path: '', component: MapPageComponent, children: [
          {path: 'about', component: AboutComponent, resolve:
              {about: () => inject(DialogService).openAboutDialog()},
          },
        ]
      },
    ]
  },
  {path: '**', redirectTo: '', pathMatch: 'full'}, //page not found redirect to main
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
