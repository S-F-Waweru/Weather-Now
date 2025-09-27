
import {createActionGroup, props} from '@ngrx/store';



// todo: change the any to AnInterface
export const getWeatherActions = createActionGroup(
  {
    source: '[Weather] Get Weather',
    events: {
      'Get CityCoordinates': props<{city: string}>(),
      'Get CityCoordinates Success': props<{data: any}>(),
      'Get CityCoordinates Failure': props<{error: any}>(),

      'Get Weather': props<{lat: string, lng:string}>(),
      'Get Weather Success': props<{data: any}>(),
      'Get Weather Failure': props<{error: any}>(),
    }
  }
)
