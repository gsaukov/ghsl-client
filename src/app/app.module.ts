import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {MainPageComponent} from './main-page/main-page.component';
import {MapPageComponent} from './main-page/map-page/map-page.component';
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterOutlet} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {ToolbarComponent} from "./main-page/map-page/toolbar/toolbar.component";
import {MatSliderModule} from '@angular/material/slider';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatCheckbox} from "@angular/material/checkbox";

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    MapPageComponent,
    ToolbarComponent,
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterOutlet,
        AppRoutingModule,
        MatSliderModule,
        MatCheckbox,
    ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],
  schemas: []
})
export class AppModule {
}
