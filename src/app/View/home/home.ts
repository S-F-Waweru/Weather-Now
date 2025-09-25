import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {debounceTime, Observable, Subject} from 'rxjs';
import {WeatherService} from '../../Services/weather-service';
import { Store } from '@ngrx/store';
import { AppState } from '../../State';
import { WeatherAction } from '../../State/Actions/weather.actions';
import { getCitySuccessSelectoer } from '../../State/Selectors/weather.selectors.ts/weather.selectors';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
})
export class Home implements OnInit {
  constructor( 
    private store:Store<AppState>,
    private cdr: ChangeDetectorRef) { }
  search$ = new Subject<string>()
   service = inject(WeatherService)
   results: any[] = []
  isSearching = false;

  
cities$! :Observable<string>
  

  ngOnInit() {
    this.search$
      .pipe(debounceTime(300))
      .subscribe(term =>
    {
      this.isSearching = true;
      this.cdr.detectChanges();
      this.searchCity(term)
    });

    // this.cities$ = this.store.select(getCitySuccessSelectoer)
  }

  onType(event : Event){

    const value = (event.target as HTMLInputElement).value
    this.search$.next(value)
    this.isSearching = false
    this.cdr.detectChanges();
  }

  searchCity(term: string) {
    this.isSearching = true;
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


    this.store.dispatch(WeatherAction.getCity({ city: term }))
  }

  onSelect(result: any) {
    this.isSearching = false;
    const lat  = result.lat
    const lng = result.lng

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

    this.store.dispatch(WeatherAction.getCityForecast({lat, lng}))
  }

}


