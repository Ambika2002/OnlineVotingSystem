import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  constructor(private router: Router) {}

  // Method to navigate to the login page for voters or admin
  navigateTo(userType: string): void {
    if (userType === 'voter') {
      this.router.navigate(['/register']);
    } else if (userType === 'admin') {
      this.router.navigate(['/login']);
    }
  }

  // Method to view election results
  viewResults(): void {
    this.router.navigate(['/results']);
  }
}
