import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {MainPageComponent} from './main-page/main-page.component';
import {MapPageComponent} from './main-page/map-page/map-page.component';
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterOutlet} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    MapPageComponent,
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterOutlet,
        AppRoutingModule,
    ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: []
})
export class AppModule {
}
