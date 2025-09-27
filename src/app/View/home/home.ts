import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {debounceTime, Subject} from 'rxjs';
import {WeatherService} from '../../Services/weather-service';
import {WeatherData} from '../../Models';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
})
export class Home implements OnInit {
  constructor( private cdr: ChangeDetectorRef) { }
  search$ = new Subject<string>()
   service = inject(WeatherService)
   results: any[] = []
  isSearching = false;

  ngOnInit() {
    this.search$
      .pipe(debounceTime(300))
      .subscribe(term =>
    {
      this.isSearching = true;
      this.cdr.detectChanges();
      this.searchCity(term)
    });
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
    this.service.getLongitudeAndLatitude(term).subscribe({
      next: (data: any) => {
        console.log("Reaching here")
        console.log(data.results);
        this.results = data.results;
        this.isSearching = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isSearching = false;
        console.log(err);
      },
      complete: () => {
        console.log("complete");
        this.isSearching = false;
        this.cdr.detectChanges();
      }
    })
  }

  onSelect(result: any) {
    this.isSearching = false;
    this.cdr.detectChanges();
    console.log(result);
    this.service.getWeatherData(result.latitude, result.longitude).subscribe({
      next: (data: WeatherData | null) => {
        if (!data) {
          console.log("No weather data available");
          return;
        }

        console.log("DARAAAA here");
        console.log(data);

        // Example: access hourly temperature
        console.log("First hourly temp:", data.hourly.temperature[0]);

        // Example: today's max temperature
        console.log("Today's max temp:", data.today?.tempMax);
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        console.log("complete");
      }
    });

  }

}


