import { createReducer, on } from "@ngrx/store"
import { City, WeatherData } from "../../Models"
import { WeatherAction } from "../Actions/weather.actions"






const emptyWeatherData : WeatherData = {
    latitude: 0,
    longitude: 0,
    elevation: 0,
    utcOffsetSeconds: 0,
    hourly: {
        time: [],
        temperature: [],
        precipitation: [],
        windspeed: [],
        humidity: []
    },
    daily: [],
    today: {
        date: "",
        tempMax: 0,
        tempMin: 0,
        precipitation: 0,
        windspeedMax: 0
    },
    week: []
}


export interface WeatherForecastInterface {
  getCitySuccess: City[];
  getCityFailure: string;
  getCityLoading: boolean;

  getWeatherForecastSuccess: WeatherData;
  getWeatherForcastFailure: string;
  getWeatherForecastLoading: boolean;
}

export const initialState: WeatherForecastInterface = {
        getCitySuccess: [],
        getCityFailure : '',
        getCityLoading : false,

        getWeatherForecastSuccess: emptyWeatherData,
        getWeatherForcastFailure :  '',
        getWeatherForecastLoading: false,
}


export const WeatherForecastReducer = createReducer(
    initialState, 
    on(WeatherAction.getCity, (state) => {
        return{
            ...state,
            getCitySuccess: [],
            getCityFailure : '',
            getCityLoading : true,
        }
    }),
      on(WeatherAction.getCitySuccess, (state, action) => {
        return{
            ...state,
            getCitySuccess: action.cities,
            getCityFailure : '',
            getCityLoading : false,
        }
    }),
      on(WeatherAction.getCityFailure, (state, action) => {
        return{
            ...state,
            getCitySuccess: [],
            getCityFailure : action.error,
            getCityLoading : false,
        }
      }),
      
    

    // get weatherforecast
     on(WeatherAction.getCityForecast, (state) => {
        return{
            ...state,
            getCitySuccess: [],
            getCityFailure : '',
            getCityLoading : true,
        }
    }),
     on(WeatherAction.getCityForecastSuccess, (state, action) => {
        return{
            ...state,
            getCitySuccess: action.data,
            getCityFailure : '',
            getCityLoading : false,
        }
    }),
         on(WeatherAction.getCityForecastFailure, (state, action) => {
        return{
            ...state,
            getCitySuccess: [],
            getCityFailure : action.error,
            getCityLoading : false,
        }
    })

)