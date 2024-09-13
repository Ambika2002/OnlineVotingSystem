import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-electionresult',
  templateUrl: './electionresult.component.html',
  styleUrl: './electionresult.component.css'
})
export class ElectionresultComponent {
  private APIUrl = "https://localhost:7181/api/ElectionResult/";
  results: any = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.refreshResults();
  }

  refreshResults(){
    this.http.get(this.APIUrl + "GetElectionResults").subscribe(data => {
      this.results = data;
      console.log(this.results);
    });

  
  }
}
