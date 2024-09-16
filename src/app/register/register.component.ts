import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


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

  constructor(private http: HttpClient, private router: Router) { }

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
        console.log(response);
        this.clearRegisterForm();
      },
      (error) => {
        console.error('Error during registration:', error);
        alert('Registration failed: ' + error.error);
      }
    );
  }

  // Method to log in an existing voter
  loginVoter() {
    const loginRequest = {
      voterId: this.loginForm.voterId,
      passwordHash: this.loginForm.passwordHash
    };

    this.http.post(this.APIUrl + 'LoginVoter', loginRequest).subscribe(
      (response: any) => {
        alert(response.message || 'Login successful!');
        console.log(response);
        this.clearLoginForm();
        this.router.navigate(['/voterdetails'], { state: { voter: response.voter } });
        // Add any further login handling here, such as navigation
      },
      (error) => {
        console.error('Error during login:', error);
        alert('Login failed: ' + error.error.message);
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
