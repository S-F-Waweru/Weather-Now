import {Component, OnInit, signal} from '@angular/core';
import {Router, RouterOutlet } from '@angular/router';
import {Home} from './View/home/home';
import {NetworkStatusService} from './Services/network-status-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'

})
export class App implements OnInit{
    constructor(private net: NetworkStatusService, private router: Router) {}
  ngOnInit(): void {
    this.net.isOnline$.subscribe(online => {
      if (!online) {
        this.router.navigate(['/offline'])
      }
    })
  }
}
