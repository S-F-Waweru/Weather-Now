import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {combineLatest, debounceTime, map, Observable, Subject} from 'rxjs';
import {WeatherService} from '../../Services/weather-service';
import { Store } from '@ngrx/store';

import { AppState } from '../../state';
import { WeatherAction } from '../../state/Actions/weather.actions';
import { getCitySuccessSelectoer, isSearchingSelecotor } from '../../state/Selectors/weather.selectors.ts/weather.selectors';
import { AsyncPipe } from '@angular/common';
import { City } from '../../Models';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
})
export class Home implements OnInit {
  search$ = new Subject<string>();
  service = inject(WeatherService);
  state = inject(Store<AppState>);
  private cdr = inject(ChangeDetectorRef);
  results: any[] = [];

  isSearching$! :Observable<boolean>;
  cities$!: Observable<City[]>;
  showResults$! :Observable<boolean>;

  ngOnInit() {
    this.search$.pipe(debounceTime(300)).subscribe((term) => {
      this.cdr.detectChanges();
      this.searchCity(term);
    });

    this.isSearching$= this.state.select(isSearchingSelecotor);
    this.cities$ = this.state.select(getCitySuccessSelectoer)

    // Add logging
    this.cities$.subscribe(cities => console.log('Cities in component:', cities));
    this.isSearching$.subscribe(searching => console.log('Is searching:', searching));

    // Combine the observables to determine when to show results
    this.showResults$ = combineLatest([
      this.isSearching$,
      this.cities$
    ]).pipe(
      map(([isSearching, cities]) => {
        // console.log(' cities);
        return !isSearching && cities && cities.length > 0;
      })
    );

    this.showResults$.subscribe(show => console.log('Show results:', show));

    
  }

  onType(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search$.next(value);
   
    this.cdr.detectChanges();
  }

  searchCity(term: string) {
    console.log(term);
    // this.service.getLongitudeAndLatitude(term).subscribe({
    //   next: (data: any) => {
    //     console.log("Reaching here")
    //     console.log(data.results);
    //     this.results = data.results;
    //     this.isSearching = false;
    //     this.cdr.detectChanges();
    //   },
    //   error: (err: any) => {
    //     this.isSearching = false;
    //     console.log(err);
    //   },
    //   complete: () => {
    //     console.log("complete");
    //     this.isSearching = false;
    //     this.cdr.detectChanges();
    //   }
    // })

    this.state.dispatch(WeatherAction.getCity({ city: term }));
  }

  onSelect(result: any) {
    const lat = result.lat;
    const lng = result.lng;

    this.cdr.detectChanges();
    console.log(result);
    // this.service.getWeatherData(result.latitude, result.longitude).subscribe({
    //   next: (data: any) => {
    //     console.log("DARAAAA here")
    //     console.log(data);
    //   },
    //   error: (err: any) => {
    //     console.log(err);
    //   },
    //   complete: () => {
    //     console.log("complete");
    //   }
    // })

    this.state.dispatch(WeatherAction.getCityForecast({ lat, lng }));
  }
}


