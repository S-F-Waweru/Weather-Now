import { createActionGroup, props } from "@ngrx/store";

export const WeatherAction = createActionGroup({
  source: "Weather API",
  events: {
    'GetCity':props<{ city: string }>(),
    'GetCitySuccess': props<{ data: any }>(),
    'GetCityFailure': props<{ error: any }>(),


    'GetCityForecast':props<{ lat:string, lng:string }>(),
    'GetCityForecastSuccess': props<{ data: any }>(),
    'GetCityForecastFailure': props<{ error: any }>(),
  }
});
