import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VotingService } from '../services/voting.service';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {
  voterId: string | null = null;
  election: any = null;
  candidates: any[] = [];

  constructor(
    private router: Router,
    private votingService: VotingService
  ) { }

  ngOnInit(): void {
    this.voterId = this.votingService.getVoterId();
    this.election = this.votingService.getElection();

    if (!this.voterId || !this.election) {
      alert('Voter or Election information is missing! Redirecting to details page.');
      this.router.navigate(['/voterdetails']);
      return;
    }

    this.candidates = this.election.candidates;
  }

  castVote(candidateId: number) {
    if (!this.voterId || !this.election) {
      alert('Voter or Election information is missing!');
      return;
    }

    const voteRequest = {
      voterId: this.voterId,
      electionid: this.election.e_Id,
      candidateid: candidateId
    };

    this.votingService.castVote(voteRequest).subscribe(
      (response) => {
        alert('Vote cast successfully!');
        this.router.navigate(['/voterdetails']);
      },
      (error) => {
        console.error('Error casting vote:', error);
        alert('Error casting vote: ' + error.error.message);
      }
    );
  }
}














// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { VotingService } from '../services/voting.service';

// @Component({
//   selector: 'app-vote',
//   templateUrl: './vote.component.html',
//   styleUrls: ['./vote.component.css']
// })
// export class VoteComponent implements OnInit {
//   voterId: string;
//   electionId: number;
//   candidates: any[] = [];
//   elections: any[] = [];



//   constructor(
//     private router: Router,
//     private votingService: VotingService
//   ) {
//     const navigation = this.router.getCurrentNavigation();
//     const state = navigation?.extras.state as { voterId: string, electionId: number };
//     this.voterId = state?.voterId;
//     this.electionId = state?.electionId;

//     console.log(this.voterId,this.electionId)
//     if (!this.voterId || !this.electionId) {
//       alert('Voter or Election information is missing! Redirecting to details page.');
//       this.router.navigate(['/voterdetails']);
//     }
//   }

//   ngOnInit(): void {
//     this.getCandidates();
//     this.getElections();
//   }

//   getCandidates() {
//     this.votingService.getAllCandidates().subscribe(
//       (data) => {
//         this.candidates = data;
//       },
//       (error) => {
//         console.error('Error fetching candidates:', error);
//       }
//     );
//   }

//   getElections() {
//     this.votingService.getAllElections().subscribe(
//       (data) => {
//         this.elections = data;
//       },
//       (error) => {
//         console.error('Error fetching elections:', error);
//       }
//     );
  
//   }

//   castVote(candidateId: number) {
//     const voteRequest = {
//       voterId: this.voterId,
//       electionid: this.electionId,
//       candidateid: candidateId
      
//     };
//     console.log(voteRequest);
//     this.votingService.castVote(voteRequest).subscribe(
//       (response) => {
//         alert('Vote cast successfully!');
//         this.router.navigate(['/voterdetails']);
//       },
//       (error) => {
//         console.error('Error casting vote:', error);
//         alert('Error casting vote: ' + error.error.message);
//       }
//     );
//   }
// }
// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { VotingService } from '../services/voting.service';

// @Component({
//   selector: 'app-vote',
//   templateUrl: './vote.component.html',
//   styleUrls: ['./vote.component.css']
// })
// export class VoteComponent implements OnInit {
//   voterId: string;
//   election: any;
//   candidates: any[] = [];

//   constructor(
//     private router: Router,
//     private votingService: VotingService
//   ) {
//     const navigation = this.router.getCurrentNavigation();
//     const state = navigation?.extras.state as { voterId: string, election: any, candidates: any[] };
//     this.voterId = state?.voterId;
//     this.election = state?.election;
//     this.candidates = state?.candidates;

//     if (!this.voterId || !this.election || this.candidates.length === 0) {
//       alert('Voter or Election information is missing! Redirecting to details page.');
//       this.router.navigate(['/voterdetails']);
//     }
//   }

//   ngOnInit(): void {
//     // No need to fetch data again since it's passed from VoterDetailsComponent
//   }

//   castVote(candidateId: number) {
//     if (!this.voterId || !this.election || !candidateId) {
//       alert('Missing required information to cast a vote.');
//       return;
//     }

//     const voteRequest = {
//       voterId: this.voterId,
//       electionid: this.election.e_Id,
//       candidateid: candidateId
//     };

//     this.votingService.castVote(voteRequest).subscribe(
//       (response) => {
//         alert('Vote cast successfully!');
//         this.router.navigate(['/voterdetails']);
//       },
//       (error) => {
//         console.error('Error casting vote:', error);
//         alert('Error casting vote: ' + error.error.message);
//       }
//     );
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-vote',
//   templateUrl: './vote.component.html',
//   styleUrls: ['./vote.component.css']
// })
// export class VoteComponent implements OnInit {
//   voterId: string;
//   election: any;
//   candidates: any[] = [];
//   private APIUrl = "https://localhost:7181/api/Voter/";

//   constructor(
//     private router: Router,
//     private http: HttpClient
//   ) {
//     const navigation = this.router.getCurrentNavigation();
//     const state = navigation?.extras.state as { voterId: string, election: any };
//     this.voterId = state?.voterId;
//     this.election = state?.election;

//     if (!this.voterId || !this.election || !this.election.election.e_Id) {
//       alert('Voter or Election information is missing! Redirecting to details page.');
//       this.router.navigate(['/voterdetails']);
//     } else {
//       this.candidates = this.election.candidates;
//     }
//   }

//   ngOnInit(): void {
//     // All data is passed via state; no need to fetch again
//   }

//   castVote(candidateId: number) {
//     if (!this.voterId || !this.election.election.e_Id || !candidateId) {
//       alert('Missing required information to cast a vote.');
//       return;
//     }

//     const voteRequest = {
//       voterId: this.voterId,
//       electionid: this.election.election.e_Id,
//       candidateid: candidateId
//     };

//     this.http.post(this.APIUrl + 'CastVote', voteRequest).subscribe(
//       (response) => {
//         alert('Vote cast successfully!');
//         this.router.navigate(['/voterdetails']);
//       },
//       (error) => {
//         console.error('Error casting vote:', error);
//         alert('Error casting vote: ' + error.error.message);
//       }
//     );
//   }
// }
// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-vote',
//   templateUrl: './vote.component.html',
//   styleUrls: ['./vote.component.css']
// })
// export class VoteComponent implements OnInit {
//   voterId: string;
//   election: any;
//   candidates: any[] = [];
//   private APIUrl = "https://localhost:7181/api/Voter/";

//   constructor(
//     private router: Router,
//     private http: HttpClient
//   ) {
//     const navigation = this.router.getCurrentNavigation();
//     const state = navigation?.extras.state as { voterId: string, election: any };
//     this.voterId = state?.voterId;
//     this.election = state?.election;
//     console.log(this.voterId,this.election);

//     if (!this.voterId || !this.election || !this.election.election.e_Id) {
//       alert('Voter or Election information is missing! Redirecting to details page.');
//       this.router.navigate(['/voterdetails']);
//     } else {
//       this.candidates = this.election.candidates;
//     }
//   }

//   ngOnInit(): void {
//     // Data is already loaded in the constructor, no further initialization needed.
//   }

//   castVote(candidateId: number) {
//     if (!this.voterId || !this.election.e_Id || !candidateId) {
//       alert('Missing required information to cast a vote.');
//       return;
//     }

//     const voteRequest = {
//       voterId: this.voterId,
//       electionid: this.election.e_Id, // Ensure e_Id is correctly mapped here
//       candidateid: candidateId
//     };

//     console.log(voteRequest);
//     this.http.post(this.APIUrl + 'CastVote', voteRequest).subscribe(
//       (response) => {
//         alert('Vote cast successfully!');
//         this.router.navigate(['/voterdetails']);
//       },
//       (error) => {
//         console.error('Error casting vote:', error);
//         alert('Error casting vote: ' + error.error.message);
//       }
//     );
//   }
// }
