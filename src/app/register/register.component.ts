import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})


export class RegisterComponent {
  
  private APIUrl = "https://localhost:7181/api/Voter/"; // Adjust the base URL as needed

  registerForm = {
    voterId: '',
    email: '',
    passwordHash: ''
  };

  loginForm = {
    voterId: '',
    passwordHash: ''
  };

  constructor(private http: HttpClient, private router: Router,private authService: AuthService) { }

  // Method to register a new voter
  registerVoter() {
    const voterRequest = {
      voterId: this.registerForm.voterId,
      email: this.registerForm.email,
      passwordHash: this.registerForm.passwordHash // Ensure your backend is hashing the password
    };

    this.http.post(this.APIUrl + 'RegisterVoter', voterRequest).subscribe(
      (response) => {
        alert('Registration successful!');
        //console.log(response);
        this.clearRegisterForm();
      },
      (error) => {
        console.error('Error during registration:', error);
        alert('Registration failed: ' + error.error);
      }
    );
  }



  loginVoter() {
    const loginRequest = {
      voterId: this.loginForm.voterId,
      passwordHash: this.loginForm.passwordHash
    };
  
    this.authService.voterLogin(loginRequest).subscribe(
      (response: any) => {
        alert(response.message || 'Login successful!');
  
        // Store the JWT token for future use
        this.authService.setToken(response.token);
  
        // Log the response and voter object
       // console.log(response);
  
        // Clear the login form
        this.clearLoginForm();
  
        // Navigate to voterdetails page and pass voter object including voterId
        this.router.navigate(['/voterdetails'], { state: { voter: response.voter } });
      },
      (error) => {
        console.error('Error during login:', error);
        alert('Login failed: ' + (error.error.message || 'Unknown error occurred'));
      }
    );
  }


  // Clear registration form fields
  clearRegisterForm() {
    this.registerForm.voterId = '';
    this.registerForm.email = '';
    this.registerForm.passwordHash = '';
  }

  // Clear login form fields
  clearLoginForm() {
    this.loginForm.voterId = '';
    this.loginForm.passwordHash = '';
  }
}
