import {Injectable} from '@angular/core';
import ImageStatic from "ol/source/ImageStatic";
import ImageLayer from "ol/layer/Image";
import {Projection} from "ol/proj";
import {Polygon} from "ol/geom";
import Static from "ol/source/ImageStatic";
import {TileLayerService} from "./tile-layer.service";
import {Extent} from "ol/extent";
import OlMap from "ol/Map";

// An array of numbers representing an extent: [minx, miny, maxx, maxy].
// let extent = [9.992083316153526, 39.099583378875366, 19.992083276545834, 49.09958333862941]
// let extent = [9.992083316153526, 29.099583419121316, 19.992083276545834, 59.09958329838346]

@Injectable({
  providedIn: 'root'
})
export class ImageLayerService {

  constructor() {
  }

  addImageLayerFromPolygon(map:OlMap, polygon: Polygon) {
    let extent = polygon.getExtent()
    const url = `https://localhost:4200/assets/${polygon.get(TileLayerService.ID)}.png`
    return this.addImageLayerFromExtentAndUrl(map, extent, url);
  }

  addImageLayerFromExtentAndUrl(map:OlMap, extent: Extent, url: string) {
    let projection = new Projection({code:'EPSG:4326'})
    let imageStatic = new ImageStatic({
      url: url,
      imageExtent: extent,
      attributions: 'none',
      projection: projection,
      interpolate: false, // when false displays pixels and do smooth/blurs images on zoom.
    })
    // static image
    let imageLayer = new ImageLayer({
      source: imageStatic,
      className: 'ghsl-image',
      opacity: 1,
      visible: true,
      map: map
    });
  }

}
