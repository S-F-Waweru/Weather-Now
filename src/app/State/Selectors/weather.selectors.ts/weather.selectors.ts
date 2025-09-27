import { createFeatureSelector, createSelector, State } from "@ngrx/store";
import { WeatherForecastInterface } from "../../Reducers/weather.reducer";

const weatherForecastFeature = createFeatureSelector<WeatherForecastInterface>('weatherForecast')

export const  getCitySuccessSelectoer = createSelector
   (weatherForecastFeature, 
       (state) => {
           console.log(state.getCitySuccess);
           return state.getCitySuccess;
       
   } )
export const  getCityFailureSelector = createSelector(
    weatherForecastFeature, 
    (state) => state.getCityFailure
)

export const isSearchingSelecotor = createSelector(
  weatherForecastFeature,
  (state) => state.getCityLoading
);

// weather Forecast

export const getCityForecastSuccessSelector = createSelector(
    weatherForecastFeature, 
    (state) => state.getWeatherForecastSuccess
)

export const getCityForecastFailureSelector = createSelector(
    weatherForecastFeature, 
    (state) => state.getWeatherForcastFailure
)