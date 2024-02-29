import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NominatimService {

  constructor(private http: HttpClient) {
  }

  getData(dataFile: string): Observable<string> {
    return this.http.get(`assets/${dataFile}`, { responseType: 'text' })
  }


}
