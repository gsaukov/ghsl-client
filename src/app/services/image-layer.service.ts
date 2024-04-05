import {Injectable} from '@angular/core';
import ImageStatic from "ol/source/ImageStatic";
import ImageLayer from "ol/layer/Image";
import ImageSource from 'ol/source/Image';
import ImageObject from 'ol/Image'
import Map from "ol/Map";
import {fromLonLat, Projection} from "ol/proj";
import {Icon, Stroke, Style} from "ol/style";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {Feature} from "ol";
import {Point, Polygon} from "ol/geom";
import Static from "ol/source/ImageStatic";
import View from "ol/View";
import {Vector} from "ol/layer";

@Injectable({
  providedIn: 'root'
})
export class ImageLayerService {

  constructor() {
  }

  createImageLayer(map: Map): ImageLayer<Static> {
    let extent = [1584998.2185214162, 5816552.104388772, 1589890.1883316676, 5821444.074199023]
    let projection = new Projection({code:'EPSG:3857'})
    let imageStatic = new ImageStatic({
      url: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Black.png',
      imageExtent: extent,
      projection: projection,
      // imageSize: [512, 512], // for some reason the image gets stretched to 513 x 512 when displayed
    })


    // static image
    let imageLayer = new ImageLayer({
      source: imageStatic,
      opacity: 0.5
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

    // create map
    // let map = new ol.Map({
    //   target: 'map',
    //   layers: [
    //     new ol.layer.Tile({
    //       source: new ol.source.OSM()
    //     }),
    //     vectorLayer,
    //     imageLayer
    //
    //   ],
    //   view: new View({
    //     center: [extent[2], extent[1]],
    //     zoom: 18
    //   })
    // });

    // source extents are still the same but they differ on the map
    // console.log("poly: " + vectorLayer.getSource().getExtent());
    map.addLayer(vectorLayer)
    map.addLayer(imageLayer)
    console.log("image: " + imageLayer.getSource()!.getImageExtent());









//     const imageextent = fromLonLat([9.992083316153526, 49.09958333862941, 19.992083276545834, 39.099583378875366]);
//     const extent = [0,0,1200,1200];
//
//     // "topRightCorner": [
//     //   19.992083276545834,
//     //   49.09958333862941
//     // ],
//     //   "bottomLeftCorner": [
//     //   9.992083316153526,
//     //   39.099583378875366
//     // ],
//     //   "topLeftCorner": [
//     //   9.992083316153526,
//     //   49.09958333862941
//     // ],
//     //   "bottomRightCorner": [
//     //   19.992083276545834,
//     //   39.099583378875366
//     // ],
//
//     const projection = new Projection({
//       code: 'EPSG:4326',
//       units: 'pixels',
//       extent: extent,
//     });
//
// // Creating a new image layer using my PNG image as a static source
//     const imageLayer = new ImageLayer({
//       source: new ImageStatic({
//         url: 'https://localhost:4200/assets/GHS_POP_E2025_GLOBE_R2023A_4326_30ss_V1_0_R5_C20_TEST.png',
//         imageExtent: extent,
//         // projection: projection,
//       }),
//       // minZoom: 0,
//       // maxZoom: 20,
//       // className: 'Image_Layer',
//       // opacity: 0.5,
//       extent: imageextent,
//       map: map  // This should add the image as an overlay
//     })



    map.setView(new View({
      center: [extent[2], extent[1]],
      zoom: 18
    }))

    return imageLayer;
  }

}
