import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NetworkStatusService } from './Services/network-status-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet], // Only include what you're actually using in the template
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css',
})
export class App implements OnInit {
  private router = inject(Router);

  constructor(private net: NetworkStatusService) {}

  ngOnInit(): void {
    this.net.isOnline$.subscribe((online) => {
      if (!online) {
        this.router.navigate(['/offline']);
      }
    });
  }
}
