import {Injectable} from '@angular/core';
import ImageStatic from "ol/source/ImageStatic";
import ImageLayer from "ol/layer/Image";
import ImageSource from 'ol/source/Image';
import ImageObject from 'ol/Image'
import Map from "ol/Map";
import {Projection} from "ol/proj";

@Injectable({
  providedIn: 'root'
})
export class ImageLayerService {

  constructor() {
  }

  createImageLayer(map: Map): ImageLayer<ImageStatic|ImageSource> {
    const imageextent = //[9.992083316153526, 49.09958333862941, 19.992083276545834, 39.099583378875366];
    [-180, -90, 180, 90]

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

    // Define the image path relative to your Angular assets folder
    const imagePath = 'assets/GHS_POP_E2025_GLOBE_R2023A_4326_30ss_V1_0_R5_C20.png';


    const imageStatic =  new ImageStatic({
      url: 'assets/GHS_POP_E2025_GLOBE_R2023A_4326_30ss_V1_0_R5_C20.png',
      imageExtent: imageextent,
      projection: 'EPSG:4326',
      crossOrigin: '',
      // imageLoadFunction: imageLoadFunction,
    })

// Create an ImageSource instance
    // @ts-ignore
    const imageSource = new ImageSource({
      loader: function(image, src) {
        // image.getImage().src = src;
        console.log("it loads me now")
        return imageStatic.getImage(imageextent, 1200, 1200, new Projection({code:'EPSG:4326'})).getImage();

      },
      // url: imagePath,
      // Assuming you know the image extent in the chosen projection (EPSG:4326 here)
      // extent: [ /* Replace with your image extent values (e.g., [-180, -90, 180, 90]) */ ],
    });

// Create an ImageLayer instance
    const imageLayer2 = new ImageLayer({
      source: imageSource,
    });

    function imageLoadFunction(image: any, src: any) {
      console.log("it loads me")
    }

    let sst = new ImageLayer({
      source : new ImageStatic({
        imageExtent : imageextent,
        // imageSize : [2408, 1166],
        imageLoadFunction : function(image, src) {
          // image.getImage().src = src;
          console.log("it loads me now")
        },
        url :'myurl'
      }),
      map: map
    });

// Creating a new image layer using my PNG image as a static source
    const imageLayer = new ImageLayer({
      source: new ImageStatic({
        url: 'assets/GHS_POP_E2025_GLOBE_R2023A_4326_30ss_V1_0_R5_C20.png',
        imageExtent: imageextent,
        projection: 'EPSG:4326',
        crossOrigin: '',
        // imageLoadFunction: imageLoadFunction,
      }),
      minZoom: 0,
      maxZoom: 20,
      className: 'Image_Layer',
      opacity: 0.5,
      extent: imageextent,
      // map: map  // This should add the image as an overlay
    })
    return imageLayer2;
  }

}
