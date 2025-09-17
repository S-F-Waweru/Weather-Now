import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  http = inject(HttpClient)
 searchURL = "https://geocoding-api.open-meteo.com/v1/"
  private baseUrl = 'https://api.open-meteo.com/v1/forecast';

  getLongitudeAndLatitude(city: string):Observable<any> {
    return this.http.get<any>(this.searchURL + "search?name=" + city + "&count=5&language=en")
  }

  getWeatherData(lat: string, lng: string): Observable<any | null> {
    const params = {
      latitude: lat,
      longitude: lng,
      timezone: 'auto',
      hourly: 'temperature_2m,precipitation,windspeed_10m,relativehumidity_2m',
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max'
    };

    return this.http.get<any>(this.baseUrl, { params }).pipe(
      map(response => {
        const utcOffset = response.utc_offset_seconds || 0;

        // Hourly data
        const hourlyTimes = response.hourly?.time?.map((t: string) =>
          new Date(new Date(t).getTime() + utcOffset * 1000)
        ) || [];

        const hourlyData = {
          time: hourlyTimes,
          temperature: response.hourly?.temperature_2m || [],
          precipitation: response.hourly?.precipitation || [],
          windspeed: response.hourly?.windspeed_10m || [],
          humidity: response.hourly?.relativehumidity_2m || []
        };

        // Daily data
        const dailyTimes = response.daily?.time?.map((t: string) => new Date(t)) || [];
        const dailyData = dailyTimes.map((date:any, i: any) => ({
          date,
          tempMax: response.daily.temperature_2m_max[i],
          tempMin: response.daily.temperature_2m_min[i],
          precipitation: response.daily.precipitation_sum[i],
          windspeedMax: response.daily.windspeed_10m_max[i]
        }));

        return {
          latitude: response.latitude,
          longitude: response.longitude,
          elevation: response.elevation,
          utcOffsetSeconds: utcOffset,
          hourly: hourlyData,
          daily: dailyData,
          today: dailyData[0] || null,       // For big card
          week: dailyData                   // For weekly forecast
        }
      }),
      catchError(err => {
        console.error('Failed to fetch weather data:', err);
        return of(null);
      })
    );
  }


}



export interface HourlyWeather {
  time: Date[];
  temperature_2m: number[];
  precipitation: number[];
}

export interface WeatherData {
  hourly: HourlyWeather;
  latitude: number;
  longitude: number;
  elevation: number;
  utcOffsetSeconds: number;
}


