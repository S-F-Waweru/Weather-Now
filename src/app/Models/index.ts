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

// export interface LocationData {
//   id: number;
//   name: string;
//   latitude: number;
//   longitude: number;
//   elevation: number;
//   feature_code: string;
//   country_code: string;
//   timezone: string;
//   population: number;
//   country_id: number;
//   country: string;
// }

export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  timezone: string;
  population?: number;
  postcodes?: string[];
  country_id: number;
  country: string;
  // Dynamic admin ID fields: admin1_id, admin2_id, admin3_id, etc.
  [key: `admin${number}_id`]: number;
  // Dynamic admin name fields: admin1, admin2, admin3, etc.
  [key: `admin${number}`]: string;
}