import { createFeatureSelector, createSelector } from "@ngrx/store";
import { WeatherForecastInterface } from "../../Reducers/weather.reducer";

const weatherForecastFeature = createFeatureSelector<WeatherForecastInterface>('weatherForecast')

export const  getCitySuccessSelectoer = createSelector
   (weatherForecastFeature, 
   (state) => state.getCitySuccess )
export const  getCityFailureSelector = createSelector(
    weatherForecastFeature, 
    (state) => state.getCityFailure
)

// weather Forecast

export const getCityForecastSuccessSelector = createSelector(
    weatherForecastFeature, 
    (state) => state.getWeatherForecastSuccess
)

export const getCityForecastFailureSelector = createSelector(
    weatherForecastFeature, 
    (state) => state.getWeatherForcastFailure
)