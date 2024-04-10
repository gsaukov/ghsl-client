import {Injectable} from '@angular/core';
import Map from "ol/Map";
import {transformExtent} from "ol/proj";
import {Polygon} from "ol/geom";
import {getBottomLeft, getBottomRight, getTopLeft, getTopRight} from "ol/extent";
import {meta30ss} from "./metaData30ss"
import {ImageLayerService} from "./image-layer.service";

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
  visiblePolygons: Polygon[] = [];

  constructor(private imageLayerService:ImageLayerService) {
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
      const mapViewPolygon = new Polygon([[tl, tr, br, bl, tl]]);

      this.polygonsArray.forEach(layerPolygon => {
        const layerPolygonExtent = layerPolygon.getExtent()
        if (mapViewPolygon.intersectsExtent(layerPolygonExtent)) {
          this.visiblePolygons.push(layerPolygon);
          const imageTile = this.imageLayerService.createImageLayer(layerPolygon)
          map.addLayer(imageTile)
        }
      })
    })
  }

  getPolygons():Polygon[] {
    const polygons: Polygon[] = []
    Object.keys(meta30ss).forEach(function(key){
      const tl = meta30ss[key].topLeftCorner
      const tr = meta30ss[key].topRightCorner
      const bl = meta30ss[key].bottomLeftCorner
      const br = meta30ss[key].bottomRightCorner
      const polygon = new Polygon([[tl, tr, br, bl, tl]]);
      polygon.set("id", key)
      polygons.push(polygon);
    });
    return polygons
  }

}
