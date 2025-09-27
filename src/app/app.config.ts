import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { WeatherForecastReducer } from './State/Reducers/weather.reducer';
import { WeatherEffects } from './State/Effects/weather.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideStore({weatherForecast: WeatherForecastReducer}),
    provideEffects([WeatherEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
]
};
