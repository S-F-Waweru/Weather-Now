import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  http = inject(HttpClient)
 searchURL = "https://geocoding-api.open-meteo.com/v1/"

  getLongitudeAndLatitude(city: string):Observable<any> {
    return this.http.get<any>(this.searchURL + "search?name=" + city + "&count=5&language=en")
  }

  getWeatherData(lat:string, lng:string){

  }
}






