export interface WeatherData {
  latitude: number;
  longitude: number;
  elevation: number;
  utcOffsetSeconds: number;
  hourly: HourlyData;
  daily: DailyDataItem[];
  today: DailyDataItem;
  week: DailyDataItem[];
}

export interface HourlyData {
  time: string[];
  temperature: number[];
  precipitation: number[];
  windspeed: number[];
  humidity: number[];
}

export interface DailyDataItem {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  windspeedMax: number;
}

export interface LocationData {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  timezone: string;
  population: number;
  country_id: number;
  country: string;
}
