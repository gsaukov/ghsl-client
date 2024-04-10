import {Injectable} from '@angular/core';
import Map from "ol/Map";
import {transformExtent} from "ol/proj";
import {Polygon} from "ol/geom";
import {getBottomLeft, getBottomRight, getTopLeft, getTopRight} from "ol/extent";
import {meta30ss} from "./metaData30ss"

@Injectable({
  providedIn: 'root'
})
export class TileLayerService {

  //check:
  // https://openlayers.org/en/latest/examples/sea-level.html
  // https://stackoverflow.com/questions/57319221/how-to-create-custom-tiles-that-fit-on-a-certain-extent-openlayers5
  // https://gis.stackexchange.com/questions/344604/openlayers-smoothly-change-tile-source-on-zoom
  // https://gis.stackexchange.com/questions/234039/min-max-zoom-levels-for-a-tilelayer
  // LAZY loading: https://stackoverflow.com/questions/77428955/openlayer-on-zooming-map-image-filter-get-only-visible-areas-on-map

  polygonsArray: Polygon[]

  constructor() {
    this.polygonsArray = this.getPolygons()
    console.log(this.polygonsArray)
  }

  createTileLayer(map: Map) {
    this.mapTiler(map)
  }

  mapTiler (map: Map) {
    map.on('moveend', () => {
      const mapExtent =  map.getView().calculateExtent(map.getSize());
      const extent = transformExtent(mapExtent, 'EPSG:3857', 'EPSG:4326');
      const tl = getTopLeft(extent);
      const tr = getTopRight(extent);
      const bl = getBottomLeft(extent);
      const br = getBottomRight(extent);
      const polygon = new Polygon([[tl, tr, br, bl, tl]]);

      const visibleFeature: Polygon[] = [];
      this.polygonsArray.forEach(item => {
        const polygonExtent = item.getExtent()
        if (polygon.intersectsExtent(polygonExtent)) {
          visibleFeature.push(item);
        }
      })
      console.log('visibleFeature', visibleFeature);
      // console.log('extent', extent);
    })
  }

  getPolygons():Polygon[] {
    const polygons: Polygon[] = []
    Object.keys(meta30ss).forEach(function(key){
      const tl = meta30ss[key].topLeftCorner
      const tr = meta30ss[key].topRightCorner
      const bl = meta30ss[key].bottomLeftCorner
      const br = meta30ss[key].bottomRightCorner
        polygons.push(new Polygon([[tl, tr, br, bl, tl]]));
    });
    return polygons
  }

}
