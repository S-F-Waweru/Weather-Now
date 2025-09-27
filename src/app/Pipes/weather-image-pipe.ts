import { Pipe, PipeTransform } from '@angular/core';

interface DayWeather {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  windspeedMax: number;
  humidity: number;
}

@Pipe({
  name: 'getWeatherImagePipe',
})
export class WeatherImagePipe implements PipeTransform {
  transform(dayData: DayWeather): string {
    const { precipitation, tempMin, humidity, windspeedMax } = dayData;

    // Snow conditions (cold + precipitation)
    if (tempMin <= 2 && precipitation > 0) {
      return '/assets/Snow.svg';
    }

    // Thunderstorms (heavy rain + high wind)
    if (precipitation > 25 || (precipitation > 10 && windspeedMax > 15)) {
      return '/assets/Thunderstorms.svg';
    }

    // Fog conditions (very high humidity + low wind + little/no precipitation)
    if (humidity > 90 && windspeedMax < 5 && precipitation < 1) {
      return '/assets/Fog.svg';
    }

    // Rain conditions
    if (precipitation > 10) {
      return '/assets/Rain.svg';
    } else if (precipitation > 0.5) {
      return '/assets/Rain.svg';
    } else if (precipitation > 0) {
      return '/assets/Drizzle.svg';
    }

    // Clear/Cloudy conditions (no precipitation)
    if (precipitation === 0) {
      if (humidity > 75) {
        return '/assets/Overcast.svg'; // High humidity = overcast
      } else if (humidity > 50) {
        return '/assets/Partly Cloudy.svg'; // Moderate humidity = partly cloudy
      } else {
        return '/assets/Clear-sunny.svg'; // Low humidity = clear/sunny
      }
    }

    // Fallback
    return '/assets/Partly Cloudy.svg';
  }
}
