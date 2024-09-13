import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-electionsview',
  templateUrl: './electionsview.component.html',
  styleUrl: './electionsview.component.css'
})
export class ElectionsviewComponent {
  private APIUrl = "https://localhost:7181/api/Voter/";

  elections: any = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.refreshElections();
  }

  // Elections CRUD Operations

  refreshElections() {
    this.http.get(this.APIUrl + "GetAllElect").subscribe(data => {
      this.elections = data;
    });
  }
}
