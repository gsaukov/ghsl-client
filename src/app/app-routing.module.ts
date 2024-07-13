import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainPageComponent} from "./main-page/main-page.component";
import {MapPageComponent} from "./main-page/map-page/map-page.component";
import {AboutComponent} from "./main-page/map-page/legend/about/about.component";

const routes: Routes = [
  {
    path: '', component: MainPageComponent, children: [
      {path: '', component: MapPageComponent},
      {path: 'about', component: AboutComponent},
    ]
  },
  {path: '**', redirectTo: '', pathMatch: 'full'}, //page not found redirect to main
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
