import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {

  private status$ = new BehaviorSubject<boolean>(navigator.onLine)
  readonly  isOnline$ = this.status$.asObservable()
  constructor() {
    window.addEventListener('online', () => this.status$.next(true))
    window.addEventListener('offline', () => this.status$.next(false))
  }

}
