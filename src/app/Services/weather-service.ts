import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, map, catchError, of } from "rxjs";
import { City, HourlyPoint, WeatherData } from "../Models";



@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  http = inject(HttpClient);
  searchURL = 'https://geocoding-api.open-meteo.com/v1/';
  private baseUrl = 'https://api.open-meteo.com/v1/forecast';

  getLongitudeAndLatitude(city: string): Observable<City[]> {
    return this.http
      .get<{ results: City[]; generationtime_ms: number }>(
        this.searchURL + 'search?name=' + city + '&count=5&language=en'
      )
      .pipe(
        map((response) => {
          return response.results as City[];
        })
      );
  }

  // getWeatherData(lat: string, lng: string): Observable<WeatherData | null> {
  //   const params = {
  //     latitude: lat,
  //     longitude: lng,
  //     timezone: 'auto',
  //     hourly: 'temperature_2m,precipitation,windspeed_10m,relativehumidity_2m',
  //     daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max'
  //   };

  //   return this.http.get<any>(this.baseUrl, { params }).pipe(
  //     map(response => {
  //       if (!response) return null;

  //       const utcOffset = response.utc_offset_seconds || 0;

  //       // Map hourly data
  //       const hourly: WeatherData['hourly'] = {
  //         time: response.hourly?.time?.map((t: string) =>
  //           new Date(new Date(t).getTime() + utcOffset * 1000).toISOString()
  //         ) || [],
  //         temperature: response.hourly?.temperature_2m || [],
  //         precipitation: response.hourly?.precipitation || [],
  //         windspeed: response.hourly?.windspeed_10m || [],
  //         humidity: response.hourly?.relativehumidity_2m || []
  //       };

  //       // Map daily data
  //       const daily: WeatherData['daily'] = response.daily?.time?.map((t: string, i: number) => ({
  //         date: t,
  //         tempMax: response.daily.temperature_2m_max[i],
  //         tempMin: response.daily.temperature_2m_min[i],
  //         precipitation: response.daily.precipitation_sum[i],
  //         windspeedMax: response.daily.windspeed_10m_max[i]
  //       })) || [];

  //       return {
  //         latitude: response.latitude,
  //         longitude: response.longitude,
  //         elevation: response.elevation,
  //         utcOffsetSeconds: utcOffset,
  //         hourly,
  //         daily,
  //         today: daily[0] || null,
  //         week: daily
  //       };
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
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max',
    };

    return this.http.get<any>(this.baseUrl, { params }).pipe(
      map((response) => {
        if (!response) return null;

        const utcOffset = response.utc_offset_seconds || 0;

        // Map hourly data
        const hourly: WeatherData['hourly'] = {
          time:
            response.hourly?.time?.map((t: string) =>
              new Date(new Date(t).getTime() + utcOffset * 1000).toISOString()
            ) || [],
          temperature: response.hourly?.temperature_2m || [],
          precipitation: response.hourly?.precipitation || [],
          windspeed: response.hourly?.windspeed_10m || [],
          humidity: response.hourly?.relativehumidity_2m || [],
        };

        // Helper function to calculate daily humidity average
        const calculateDailyHumidity = (dayIndex: number): number => {
          const startHour = dayIndex * 24;
          const endHour = Math.min(startHour + 24, hourly.humidity.length);
          const dayHumidity = hourly.humidity.slice(startHour, endHour);

          if (dayHumidity.length === 0) return 0;

          const sum = dayHumidity.reduce((acc, val) => acc + val, 0);
          return Math.round(sum / dayHumidity.length);
        };
        const addHourlyDataToWeek = (hourly: any, daily: any[]): any[] => {
          return daily.map((day, dayIndex) => {
            const startHour = dayIndex * 24;
            const endHour = Math.min(startHour + 24, hourly.time.length);

            const dayHourlyData = {
              time: hourly.time.slice(startHour, endHour),
              temperature: hourly.temperature.slice(startHour, endHour),
              precipitation: hourly.precipitation.slice(startHour, endHour),
              windspeed: hourly.windspeed.slice(startHour, endHour),
              humidity: hourly.humidity.slice(startHour, endHour),
            };

            return {
              ...day,
              hourly: dayHourlyData,
            };
          });
        };

        // Map daily data with humidity
        const daily: WeatherData['daily'] =
          response.daily?.time?.map((t: string, i: number) => ({
            date: t,
            tempMax: response.daily.temperature_2m_max[i],
            tempMin: response.daily.temperature_2m_min[i],
            precipitation: response.daily.precipitation_sum[i],
            windspeedMax: response.daily.windspeed_10m_max[i],
            humidity: calculateDailyHumidity(i), // Add daily average humidity
          })) || [];
        
        const buildHourlyObjectsForDay = (dayIndex: number): HourlyPoint[] => {
          const start = dayIndex * 24;
          const end = start + 24;
          return hourly.time.slice(start, end).map((time, k) => ({
            time,
            temperature: hourly.temperature[start + k],
            humidity: hourly.humidity[start + k],
            windspeed: hourly.windspeed[start + k],
            precipitation: hourly.precipitation[start + k],
            // include daily values if you want them duplicated on each hour
            tempMax: daily[dayIndex].tempMax,
            tempMin: daily[dayIndex].tempMin,
          }));
        };

        const dailyWithHourlyObjs = daily.map((d, i) => ({
          ...d,
          hourly: buildHourlyObjectsForDay(i), // => array of 24 HourlyPoint objects
        }));


        const dailyWithHours = addHourlyDataToWeek(hourly, daily);
       return {
         latitude: response.latitude,
         longitude: response.longitude,
         elevation: response.elevation,
         utcOffsetSeconds: utcOffset,
         hourly, // keep raw arrays if you still need them
         daily: dailyWithHourlyObjs, // ✅ each day has hourly: HourlyPoint[]
         today: dailyWithHourlyObjs[0] || null,
         week: dailyWithHourlyObjs,
       };

      }),
      catchError((err) => {
        console.error('Failed to fetch weather data:', err);
        return of(null);
      })
    );
  }
}





