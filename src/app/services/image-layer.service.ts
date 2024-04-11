import {Injectable} from '@angular/core';
import ImageStatic from "ol/source/ImageStatic";
import ImageLayer from "ol/layer/Image";
import {Projection} from "ol/proj";
import {Polygon} from "ol/geom";
import Static from "ol/source/ImageStatic";
import {TileLayerService} from "./tile-layer.service";

@Injectable({
  providedIn: 'root'
})
export class ImageLayerService {

  constructor() {
  }

  createImageLayer(polygon: Polygon): ImageLayer<Static> {
    // An array of numbers representing an extent: [minx, miny, maxx, maxy].
    // let extent = [9.992083316153526, 39.099583378875366, 19.992083276545834, 49.09958333862941]
    let extent = polygon.getExtent()
    let projection = new Projection({code:'EPSG:4326'})
    let imageStatic = new ImageStatic({
      url: `https://localhost:4200/assets/${polygon.get(TileLayerService.ID)}.png`,
      imageExtent: extent,
      projection: projection,
      interpolate: false, // when false displays pixels and do smooth/blurs images on zoom.
    })
    // static image
    let imageLayer = new ImageLayer({
      source: imageStatic,
      className: 'ghsl-image',
      opacity: 0.5
    });

    return imageLayer;
  }

}
