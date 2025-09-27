import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap, map, catchError, of } from "rxjs";
import { WeatherService } from "../../Services/weather-service";
import { WeatherAction } from "../Actions/weather.actions";

@Injectable()
export class WeatherEffects {
   private actions$ = inject(Actions);
    private weatherService = inject(WeatherService);




   $getLatLng = createEffect(()=>{
        return this.actions$.pipe(
            ofType(WeatherAction.getCity),
            // Use switchMap so that if the user keeps typing and dispatches
            // multiple city search actions, the previous HTTP request is
            // cancelled and only the latest getLongitudeAndLatitude(city)
            // call is allowed to complete.
            switchMap(({city}) => this.weatherService.getLongitudeAndLatitude(city) .pipe(
                map(response => {
                     console.log('API response from geocoding:', response);
                     return WeatherAction.getCitySuccess({ cities: response })
                }),
                //  error Message
                catchError(error =>{
                    return of(WeatherAction.getCityFailure({error}))
                })
            ))
        
        )
   })


  $getWeatherForecast = createEffect(() => {
  return this.actions$.pipe(
    ofType(WeatherAction.getCityForecast),
    switchMap(({ lat, lng }) =>
      this.weatherService.getWeatherData(lat, lng).pipe(
        map((response: any) =>
          WeatherAction.getCityForecastSuccess({ data: response })
        ),
          catchError(error => of(WeatherAction.getCityForecastFailure({ error })))
      )
    )
  );
});

}