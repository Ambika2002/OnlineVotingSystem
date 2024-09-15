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
  winner: any = [];
  selectedElectionId: number = 0;

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

  getWinner(electionId: number) {
    this.http.get(this.APIUrl + "GetWinner/" + electionId).subscribe(data => {
      this.winner = data;
      console.log(this.winner);
    }, error => {
      console.error("Error fetching winner:", error);
    });
  }

  getElectionResults() {
    if (this.selectedElectionId > 0) {
      this.http.get(this.APIUrl + "GetResultInfo/" + this.selectedElectionId).subscribe(data => {
        this.results = data;
        console.log("Results: ", this.results);
      }, error => {
        console.error("Error fetching results:", error);
      });
    }
  }
}









// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-electionresult',
//   templateUrl: './electionresult.component.html',
//   styleUrl: './electionresult.component.css'
// })
// export class ElectionresultComponent {
//   private APIUrl = "https://localhost:7181/api/ElectionResult/";
//   results: any = [];

//   constructor(private http: HttpClient) { }

//   ngOnInit() {
//     this.refreshResults();
//   }

//   refreshResults(){
//     this.http.get(this.APIUrl + "GetElectionResults").subscribe(data => {
//       this.results = data;
//       console.log(this.results);
//     });

  
  
//   }
// }
