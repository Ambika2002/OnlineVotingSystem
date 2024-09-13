// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      alert('You are not authorized to view this page.');
      // Optionally redirect to login page
    }
  }

  // Methods to fetch voters, candidates, elections, and CRUD operations go here
}

