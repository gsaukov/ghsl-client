import {Injectable} from '@angular/core';
import ImageStatic from "ol/source/ImageStatic";
import ImageLayer from "ol/layer/Image";
import Map from "ol/Map";
import {fromLonLat, Projection} from "ol/proj";
import {Stroke, Style} from "ol/style";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {Feature} from "ol";
import {Point, Polygon} from "ol/geom";
import Static from "ol/source/ImageStatic";
import View from "ol/View";

@Injectable({
  providedIn: 'root'
})
export class ImageLayerService {

  //REWORK AS Sea Levels https://openlayers.org/en/latest/examples/sea-level.html

  constructor() {
  }

  createImageLayer(map: Map): ImageLayer<Static> {
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

    // An array of numbers representing an extent: [minx, miny, maxx, maxy].
    let extent = [9.992083316153526, 39.099583378875366, 19.992083276545834, 49.09958333862941]
    let projection = new Projection({code:'EPSG:4326'})
    let imageStatic = new ImageStatic({
      url: 'https://localhost:4200/assets/GHS_POP_E2025_GLOBE_R2023A_4326_30ss_V1_0_R5_C20.png',
      imageExtent: extent,
      projection: projection,
    })


    // static image
    let imageLayer = new ImageLayer({
      source: imageStatic,
      className: 'ghsl-image'
      // opacity: 0.5
    });

    // display extent as poly
    let poly = new Polygon([
      [
        [extent[0], extent[3]],
        [extent[0], extent[1]],
        [extent[2], extent[1]],
        [extent[2], extent[3]],

      ]
    ]);

    let vectorLayer = new VectorLayer({
      source: new VectorSource({
        wrapX: false,
        // projection: projection,
      }),
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(255,0,0,1.0)',
          width: 2,

        })
      })
    });

    vectorLayer.getSource()!.addFeature(
      new Feature({
        geometry: poly,
      })
    );

    map.addLayer(vectorLayer)
    map.addLayer(imageLayer)
    console.log("image: " + imageLayer.getSource()!.getImageExtent());

    map.setView(new View({
      center: fromLonLat([extent[2], extent[1]]),
      zoom: 6
    }))

    return imageLayer;
  }

}
