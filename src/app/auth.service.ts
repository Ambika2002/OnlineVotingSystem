import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7181/api/Admin'; // Your backend API URL

  constructor(private http: HttpClient, private router: Router) { }

  // Admin login method
  login(loginRequest: any) {
    return this.http.post<any>(`${this.apiUrl}/Login`, loginRequest);
  }

  // Store JWT token in local storage
  setToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  // Retrieve the token
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Check if admin is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; // Return true if token exists
  }

  voterLogin(loginRequest: any) {
    return this.http.post<{ token: string, voter: any }>('https://localhost:7181/api/Voter/LoginVoter', loginRequest);
  }

  // Logout method
  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/home']);
  }
}

