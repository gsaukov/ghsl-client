import {Injectable} from '@angular/core';
import Map from "ol/Map";
import {fromLonLat} from "ol/proj";
import * as turf from '@turf/turf';
import {Feature as TurfFeature, FeatureCollection as TurfFeatureCollection, MultiPolygon as TurfMultiPolygon, Polygon as TurfPolygon} from "@turf/turf";
import GeoJSON from "ol/format/GeoJSON";

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  constructor() {
  }
  loadTurfJSON(response:any) {
    var jsonObject = JSON.parse(response);
    const top = jsonObject.metaData.topLeftCorner[0]; // lon
    const left = jsonObject.metaData.topLeftCorner[1]; // lat
    const bottom = jsonObject.metaData.bottomRightCorner[0]; // lon
    const right = jsonObject.metaData.bottomRightCorner[1]; // lat
    const height = jsonObject.metaData.pixelHeightDegrees * 1.001;
    const width = jsonObject.metaData.pixelWidthDegrees * 1.001;
    const rows = jsonObject.metaData.areaWidth
    const cols = jsonObject.metaData.areaHeight
    const data = jsonObject.data.res
    const squares:TurfFeature[] = []

    for (let i = 0; i < 200; i++) {
      for (let j = 0; j < 200; j++) {
        const pixel = data[(i * cols) + j]
        if (pixel > 0) {
          let verticalPos = top + (j * height);
          let hotizontalPos = left - (i * width);
          const leftTop = [verticalPos, hotizontalPos];

          // Create a square feature
          const squarePolygon:TurfFeature = turf.polygon([[
            fromLonLat([leftTop[0], leftTop[1]]),
            fromLonLat([leftTop[0], leftTop[1] - (height * 1.01)]),
            fromLonLat([leftTop[0] + (width * 1.01), leftTop[1] - (height * 1.01)]),
            fromLonLat([leftTop[0] + (width * 1.01), leftTop[1]]),
            fromLonLat([leftTop[0], leftTop[1]]),
          ]]);
          squares.push(squarePolygon)
        }
      }
    }
    let toMerge = squares[0]
    for(let i = 1; i<squares.length; i++) {
      toMerge = turf.union(toMerge as any , squares[i] as any) as any
      if(i%1000===0){
        console.log(i)
      }
    }
    const multiPolygonFeature = new GeoJSON().readFeature(toMerge);
    multiPolygonFeature.setProperties({
      "COLOR": "#C48832",
    })
    console.log(multiPolygonFeature.getGeometry())
    return [multiPolygonFeature];
  }

}
