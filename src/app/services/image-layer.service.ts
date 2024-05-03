import {Injectable} from '@angular/core';
import ImageStatic from "ol/source/ImageStatic";
import ImageLayer from "ol/layer/Image";
import {get} from "ol/proj";
import {Polygon} from "ol/geom";
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

  opacity:number
  interpolate:boolean // when false displays pixels and true do smooth/blurs images on zoom.

  constructor() {
    this.opacity = 0.65
    this.interpolate = false
  }

  addImageLayerFromPolygon(map:OlMap, polygon: Polygon): ImageLayer<ImageStatic> {
    let extent = polygon.getExtent()
    const url = `https://localhost:4200/assets/${polygon.get(TileLayerService.RES)}/${polygon.get(TileLayerService.ID)}.png`
    return this.addImageLayerFromExtentAndUrl(map, extent, url);
  }

  addImageLayerFromExtentAndUrl(map:OlMap, extent: Extent, url: string): ImageLayer<ImageStatic> {
    let projection = get('EPSG:4326')!
    let imageStatic = new ImageStatic({
      url: url,
      imageExtent: extent,
      attributions: 'none',
      projection: projection,
      interpolate: this.interpolate,
    })
    // static image
    let imageLayer = new ImageLayer({
      source: imageStatic,
      className: 'ghsl-image',
      opacity: this.opacity,
      visible: true,
      map: map
    });

    return imageLayer;
  }

  setOpacity(opacity:number) {
    this.opacity = opacity
  }

  setInterpolate(interpolate:boolean) {
    this.interpolate = interpolate
  }

}
