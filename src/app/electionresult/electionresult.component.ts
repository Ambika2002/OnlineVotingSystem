import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-electionresult',
  templateUrl: './electionresult.component.html',
  styleUrls: ['./electionresult.component.css']
})
export class ElectionresultComponent implements OnInit {
  private APIUrl = "https://localhost:7181/api/ElectionResult/";
  results: any = [];
  winner: any = [];
  elections: any[] = []; // List of elections for dropdown
  selectedElectionId: number = 0;
  totalVotes: number = 0;
  chart: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    Chart.register(...registerables); // Register Chart.js components
    this.loadElections(); // Load elections on component init
  }

  loadElections() {
    // Fetch list of elections to populate the dropdown
    this.http.get(`${this.APIUrl}GetElectionResults`).subscribe((data: any) => {
      this.elections = data.filter((election: any, index: number, self: any) =>
        index === self.findIndex((e: any) => e.electionName === election.electionName));
    }, error => {
      console.error("Error fetching elections:", error);
    });
  }

  onElectionChange(event: any) {
    this.selectedElectionId = +event.target.value;
    this.getWinner(); // Update selectedElectionId
    this.refreshResults(); // Fetch results for the selected election
  }

  refreshResults() {
    if (this.selectedElectionId > 0) {
      this.http.get(`${this.APIUrl}GetResultInfo/${this.selectedElectionId}`).subscribe((data: any) => {
        this.results = data;
        this.calculateTotalVotes();
        this.createChart(); // Create the chart with updated data
        console.log(this.results);
      });
    }
  }

  getWinner() {
    this.http.get(`${this.APIUrl}GetWinner/${this.selectedElectionId}`).subscribe((data: any) => {
      this.winner = data;
      console.log(this.winner);
    }, error => {
      console.error("Error fetching winner:", error);
    });
  }

  calculateTotalVotes() {
    this.totalVotes = this.results.reduce((sum: number, candidate: any) => sum + candidate.totalVotes, 0);
  }

  calculateVotePercentage(candidateVotes: number) {
    return ((candidateVotes / this.totalVotes) * 100).toFixed(2);
  }

  createChart() {
    const candidates = this.results.map((result: any) => result.name);
    const votes = this.results.map((result: any) => this.calculateVotePercentage(result.totalVotes));
    const winnerId = this.results.find((result: any) => result.isWinner)?.candidateId;
console.log(candidates);
console.log(votes)
    const backgroundColors = this.results.map((result: any) =>
      result.candidateId === winnerId ? 'rgba(75, 192, 192, 0.2)' : 'rgba(153, 102, 255, 0.2)'
    );

    const borderColors = this.results.map((result: any) =>
      result.candidateId === winnerId ? 'rgba(75, 192, 192, 1)' : 'rgba(153, 102, 255, 1)'
    );

    if (this.chart) {
      this.chart.destroy(); // Destroy the previous chart before creating a new one
    }

    this.chart = new Chart('electionChart', {
      type: 'bar',
      data: {
        labels: candidates,
        datasets: [{
          label: 'Vote Percentage',
          data: votes,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Vote Percentage (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Candidates'
            }
          }
        }
      }
    });
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
//   winner: any = [];
//   selectedElectionId: number = 0;
//   totalVotes: number = 0;
  

//   constructor(private http: HttpClient) { }

//   ngOnInit() {
//     this.refreshResults();
//   }

//   refreshResults(){
//     this.http.get(this.APIUrl + "GetElectionResults").subscribe(data => {
//       this.results = data;
//       this.calculateTotalVotes();
//       console.log(this.results);
//     });
//   }

//   getWinner(electionId: number) {
//     this.http.get(this.APIUrl + "GetWinner/" + electionId).subscribe(data => {
//       this.winner = data;
//       console.log(this.winner);
//     }, error => {
//       console.error("Error fetching winner:", error);
//     });
//   }

//   calculateTotalVotes() {
//     // Calculate total votes by summing all candidates' votes
//     this.totalVotes = this.results.reduce((sum: number, candidate: any) => sum + candidate.totalVotes, 0);
//   }

//   calculateVotePercentage(candidateVotes: number) {
//     // Calculate vote percentage for each candidate
//     return ((candidateVotes / this.totalVotes) * 100).toFixed(2);
//   }


//   getElectionResults() {
//     if (this.selectedElectionId > 0) {
//       this.http.get(this.APIUrl + "GetResultInfo/" + this.selectedElectionId).subscribe(data => {
//         this.results = data;
//         this.calculateTotalVotes();
//         console.log("Results: ", this.results);
//       }, error => {
//         console.error("Error fetching results:", error);
//       });
//     }
//   }
// }









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
