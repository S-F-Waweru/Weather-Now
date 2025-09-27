import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {LocationData, WeatherData} from '../Models';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  http = inject(HttpClient)
 searchURL = "https://geocoding-api.open-meteo.com/v1/"
  private baseUrl = 'https://api.open-meteo.com/v1/forecast';

  getLongitudeAndLatitude(city: string):Observable<any> {
    return this.http.get<LocationData>(this.searchURL + "search?name=" + city + "&count=5&language=en")
  }

  // getWeatherData(lat: string, lng: string): Observable<any | null> {
  //   const params = {
  //     latitude: lat,
  //     longitude: lng,
  //     timezone: 'auto',
  //     hourly: 'temperature_2m,precipitation,windspeed_10m,relativehumidity_2m',
  //     daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max'
  //   };
  //
  //   return this.http.get<any>(this.baseUrl, { params }).pipe(
  //     map(response => {
  //       const utcOffset = response.utc_offset_seconds || 0;
  //
  //       // Hourly data
  //       const hourlyTimes = response.hourly?.time?.map((t: string) =>
  //         new Date(new Date(t).getTime() + utcOffset * 1000)
  //       ) || [];
  //
  //       const hourlyData = {
  //         time: hourlyTimes,
  //         temperature: response.hourly?.temperature_2m || [],
  //         precipitation: response.hourly?.precipitation || [],
  //         windspeed: response.hourly?.windspeed_10m || [],
  //         humidity: response.hourly?.relativehumidity_2m || []
  //       };
  //
  //       // Daily data
  //       const dailyTimes = response.daily?.time?.map((t: string) => new Date(t)) || [];
  //       const dailyData = dailyTimes.map((date:any, i: any) => ({
  //         date,
  //         tempMax: response.daily.temperature_2m_max[i],
  //         tempMin: response.daily.temperature_2m_min[i],
  //         precipitation: response.daily.precipitation_sum[i],
  //         windspeedMax: response.daily.windspeed_10m_max[i]
  //       }));
  //
  //       return {
  //         latitude: response.latitude,
  //         longitude: response.longitude,
  //         elevation: response.elevation,
  //         utcOffsetSeconds: utcOffset,
  //         hourly: hourlyData,
  //         daily: dailyData,
  //         today: dailyData[0] || null,       // For big card
  //         week: dailyData                   // For weekly forecast
  //       } as WeatherData;
  //     }),
  //     catchError(err => {
  //       console.error('Failed to fetch weather data:', err);
  //       return of(null);
  //     })
  //   );
  // }

  getWeatherData(lat: string, lng: string): Observable<WeatherData | null> {
    const params = {
      latitude: lat,
      longitude: lng,
      timezone: 'auto',
      hourly: 'temperature_2m,precipitation,windspeed_10m,relativehumidity_2m',
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max'
    };

    return this.http.get<any>(this.baseUrl, { params }).pipe(
      map(response => {
        if (!response) return null;

        const utcOffset = response.utc_offset_seconds || 0;

        // Map hourly data
        const hourly: WeatherData['hourly'] = {
          time: response.hourly?.time?.map((t: string) =>
            new Date(new Date(t).getTime() + utcOffset * 1000).toISOString()
          ) || [],
          temperature: response.hourly?.temperature_2m || [],
          precipitation: response.hourly?.precipitation || [],
          windspeed: response.hourly?.windspeed_10m || [],
          humidity: response.hourly?.relativehumidity_2m || []
        };

        // Map daily data
        const daily: WeatherData['daily'] = response.daily?.time?.map((t: string, i: number) => ({
          date: t,
          tempMax: response.daily.temperature_2m_max[i],
          tempMin: response.daily.temperature_2m_min[i],
          precipitation: response.daily.precipitation_sum[i],
          windspeedMax: response.daily.windspeed_10m_max[i]
        })) || [];

        return {
          latitude: response.latitude,
          longitude: response.longitude,
          elevation: response.elevation,
          utcOffsetSeconds: utcOffset,
          hourly,
          daily,
          today: daily[0] || null,
          week: daily
        };
      }),
      catchError(err => {
        console.error('Failed to fetch weather data:', err);
        return of(null);
      })
    );
  }



}





