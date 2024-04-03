import {Injectable} from '@angular/core';
// @ts-ignore
import GeoImageLayer from 'ol-ext/layer/GeoImage'
// @ts-ignore
import GeoImageSource from "ol-ext/source/GeoImage"
import Map from "ol/Map";
import ImageLayer from "ol/layer/Image";
import ImageSource from "ol/source/Image";

@Injectable({
  providedIn: 'root'
})
export class ImageExtLayerService {

  constructor() {
  }

  createImageLayer(map: Map): ImageLayer<ImageSource> {
    const imageextent = [9.992083316153526, 49.09958333862941, 19.992083276545834, 39.099583378875366];

    const imageMask = [
      [19.992083276545834, 49.09958333862941],
      [9.992083316153526, 39.099583378875366],
      [9.992083316153526, 49.09958333862941],
      [19.992083276545834, 39.099583378875366],
      [19.992083276545834, 49.09958333862941],
    ]

    const x= 274764.75
    const y= 6243935.64
    const sx = 0.589;
    const sy = 0.597;
    const xmin= 0
    const ymin = 0
    const xmax=1200
    const ymax =1200

    const geoImageSource = new GeoImageSource({
      url: 'https://localhost:4200/assets/GHS_POP_E2025_GLOBE_R2023A_4326_30ss_V1_0_R5_C20.png',
      imageCenter: [x,y],
      imageScale: [sx,sy],
      imageCrop: [xmin,ymin,xmax,ymax],
      imageMask: imageMask,
      // imageRotate: Number($("#rotate").val()*Math.PI/180),
      projection: 'EPSG:4326',
    })

    const geoImgLayer = new GeoImageLayer(geoImageSource, );
    map.addLayer(geoImgLayer)

    return geoImgLayer;
  }

}
