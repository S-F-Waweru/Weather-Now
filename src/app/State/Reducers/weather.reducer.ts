import { createReducer, on } from "@ngrx/store"
import { WeatherData } from "../../Services/weather-service"
import { WeatherAction } from "../Actions/weather.actions"



const emptyWeatherData : WeatherData = {
    hourly: {
        time: [],
        temperature_2m: [],
        precipitation: []
    },
    latitude: 0,
    longitude: 0,
    elevation: 0,
    utcOffsetSeconds: 0
}


export interface WeatherForecastInterface {
        getCitySuccess: string
        getCityFailure : string
        getCityLoading : boolean

        getWeatherForecastSuccess: WeatherData
        getWeatherForcastFailure : string
        getWeatherForecastLoading: boolean
}

export const initialState: WeatherForecastInterface = {
        getCitySuccess: '',
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
            getCitySuccess: '',
            getCityFailure : '',
            getCityLoading : true,
        }
    }),
      on(WeatherAction.getCitySuccess, (state, action) => {
        return{
            ...state,
            getCitySuccess: action.data,
            getCityFailure : '',
            getCityLoading : false,
        }
    }),
      on(WeatherAction.getCityFailure, (state, action) => {
        return{
            ...state,
            getCitySuccess: '',
            getCityFailure : action.error,
            getCityLoading : false,
        }
    }),

    // get weatherforecast
     on(WeatherAction.getCityForecast, (state) => {
        return{
            ...state,
            getCitySuccess: '',
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
            getCitySuccess: '',
            getCityFailure : action.error,
            getCityLoading : false,
        }
    })

)