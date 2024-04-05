import {Injectable} from '@angular/core';
// @ts-ignore
import GeoImageLayer from 'ol-ext/layer/GeoImage'
// @ts-ignore
import GeoImageSource from "ol-ext/source/GeoImage"
import Map from "ol/Map";
import ImageLayer from "ol/layer/Image";
import ImageSource from "ol/source/Image";
import View from "ol/View";
import {fromLonLat} from "ol/proj";

@Injectable({
  providedIn: 'root'
})
export class ImageExtLayerService {

  constructor() {
  }

  createImageLayer(map: Map): ImageLayer<ImageSource> {
    const imageMask = [
      //REORDER IMAGE MASK!
      fromLonLat([19.992083276545834, 49.09958333862941]),
      fromLonLat([19.992083276545834, 39.099583378875366]),
      fromLonLat([9.992083316153526, 39.099583378875366]),
      fromLonLat([9.992083316153526, 49.09958333862941]),
      fromLonLat([19.992083276545834, 49.09958333862941]),
    ]

    const x= 14.9920833999
    const y= 44.09958336
    const sx = 1200;
    const sy = 1200;

    const geoImageSource = new GeoImageSource({
      url: 'https://localhost:4200/assets/GHS_POP_E2025_GLOBE_R2023A_4326_30ss_V1_0_R5_C20.png',
      imageCenter: fromLonLat([x, y]),
      imageScale: [sx, sy],
      imageMask: imageMask,
      // imageRotate: Number($("#rotate").val()*Math.PI/180),
      // projection: 'EPSG:4326',
    })

    const geoImgLayer = new GeoImageLayer();
    geoImgLayer.setSource(geoImageSource)
    map.addLayer(geoImgLayer)
    map.setView(new View({
      center: fromLonLat([x, y]),
      zoom: 6
    }))

    //FINAL IMAGE PROJECTION IS INCORRECTLY STRETCHED!

    return geoImgLayer;
  }

}
