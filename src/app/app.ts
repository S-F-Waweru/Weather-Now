import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Home} from './View/home/home';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
