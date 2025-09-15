import {Component, inject, OnInit} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {debounce, debounceTime, Subject} from 'rxjs';
import {WeatherService} from '../../Services/weather-service';

@Component({
  selector: 'app-home',
  imports: [

  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
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
      this.searchCity(term)
    });
  }

  onType(event : Event){

    const value = (event.target as HTMLInputElement).value
    this.search$.next(value)
    this.isSearching = false
  }

  searchCity(term: string) {
    this.isSearching = true;
    console.log(term);
    this.service.getLongitudeAndLatitude(term).subscribe({
      next: (data: any) => {
        console.log("Reaching here")
        console.log(data.results);
        this.isSearching = false;
        this.results = data.results;
      },
      error: (err: any) => {
        this.isSearching = false;
        console.log(err);
      },
      complete: () => {
        console.log("complete");
        this.isSearching = false;
      }
    })
  }

}
