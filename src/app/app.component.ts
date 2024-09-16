import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ms-app5';
  private APIUrl = "https://localhost:7181/api/Admin/";

  voters: any = [];
  candidates: any = [];
  elections: any = [];

  voterInfo = {
    id:"",
    votid:"",
    name:"",
    email:"",
    passwordhash:"",
    hasvoted:""
  };

  candidateInfo = {
    candidateName: "",
    party: ""
  };

  electionInfo = {
    electionName: "",
    description: "",
    startDate: new Date(),
    endDate: new Date()
  };

 
  constructor(private authService: AuthService, private router: Router) {
    // Listen for browser back navigation
    window.onpopstate = () => {
      this.handleBackButton();
    };
  }

  // Method to handle back button logic
  handleBackButton() {
    if (this.authService.isAuthenticated()) {
      this.authService.logout(); // Log out if the user is authenticated
      alert('You have been logged out due to back navigation.');
      this.router.navigate(['/login']); // Redirect to login page
    }
  }
}
