import {Injectable} from '@angular/core';
import Static from "ol/source/ImageStatic";
import ImageLayer from "ol/layer/Image";
import Map from "ol/Map";

@Injectable({
  providedIn: 'root'
})
export class ImageLayerService {

  constructor() {
  }

  createImageLayer(map: Map): ImageLayer<Static> {
    const imageextent = [9.992083316153526, 49.09958333862941, 19.992083276545834, 39.099583378875366];

    // "topRightCorner": [
    //   19.992083276545834,
    //   49.09958333862941
    // ],
    //   "bottomLeftCorner": [
    //   9.992083316153526,
    //   39.099583378875366
    // ],
    //   "topLeftCorner": [
    //   9.992083316153526,
    //   49.09958333862941
    // ],
    //   "bottomRightCorner": [
    //   19.992083276545834,
    //   39.099583378875366
    // ],


// Creating a new image layer using my PNG image as a static source
    const imageLayer = new ImageLayer({
      source: new Static({
        url: 'assets/GHS_POP_E2025_GLOBE_R2023A_4326_30ss_V1_0_R5_C20.png',
        imageExtent: imageextent,
        projection: 'EPSG:4326',
        crossOrigin: ''
      }),
      className: 'Image_Layer',
      opacity: 0.5,
      // extent: imageextent,
      // map: map  // This should add the image as an overlay
    })
    return imageLayer;
  }

}
