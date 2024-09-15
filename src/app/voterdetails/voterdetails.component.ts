import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-voterdetails',
  templateUrl: './voterdetails.component.html',
  styleUrls: ['./voterdetails.component.css']
})
export class VoterdetailsComponent implements OnInit {
  voter: any; 
  electionsWithCandidates: any[] = []; 
  selectedElectionId: number | null = null; 
  selectedCandidateId: number | null = null; 
  private APIUrl = 'https://localhost:7181/api/Voter/'; 

  constructor(private router: Router, private http: HttpClient) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { voter: any };
    this.voter = state?.voter || {};

    console.log(this.voter);
  }

  ngOnInit() {
    if (!this.voter) {
      alert('No voter data found! Redirecting to login page.');
      this.router.navigate(['/register']);
    } else {
      this.loadActiveElectionsWithCandidates();
    }
  }

  VotingStatus(){
    this.http.get(this.APIUrl + 'HasVoted/' + this.voter.VoterId).subscribe(
      (response: any) => {
        console.log('Response from API:', response.hasVoted);  // Log response to verify structure
        this.voter.votingStatus = response.hasVoted;
     
      },
      (error) => {
        console.error('Error loading elections and candidates:', error);
        alert('Failed to load elections and candidates.');
      }
    );
  }

  loadActiveElectionsWithCandidates() {
    this.http.get(this.APIUrl + 'GetActiveElectionsWithCandidates/' + this.voter.VoterId).subscribe(
      (response: any) => {
        console.log('Response from API:', response);  // Log response to verify structure
        this.electionsWithCandidates = response;
      },
      (error) => {
        console.error('Error loading elections and candidates:', error);
        alert('Failed to load elections and candidates.');
      }
    );
  }

  selectElection(electionId: number) {
    this.selectedElectionId = electionId;
    console.log('Selected Election ID:', this.selectedElectionId);  // Debugging line
  }

  selectCandidate(candidateId: number) {
    this.selectedCandidateId = candidateId;
    console.log('Selected Candidate ID:', this.selectedCandidateId);  // Debugging line
  }

  
  castVote() {
    if (this.selectedElectionId !== null && this.selectedCandidateId !== null) {
      const voteRequest = {
        voterId: this.voter.voterId,
        electionid: this.selectedElectionId,
        candidateid: this.selectedCandidateId
      };

      this.http.post(this.APIUrl + 'CastVote', voteRequest, { responseType: 'text' }).subscribe(
        (response: string) => {
          alert(response); 
          alert(`Vote cast for candidate ID: ${this.selectedCandidateId}`);// Show the plain text response
          this.selectedElectionId = null;
          this.selectedCandidateId = null;
          this.loadActiveElectionsWithCandidates();
          this.voter.votingStatus=this.VotingStatus();
          // Refresh the list after voting
        },
        (error) => {
          console.error('Error casting vote:', error);
          alert('Error casting vote: ' + error.error);
        }
      );
    } else {
      alert('Please select both an election and a candidate.');
    }
    
}
  }
  





// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-voterdetails',
//   templateUrl: './voterdetails.component.html',
//   styleUrls: ['./voterdetails.component.css']
// })
// export class VoterdetailsComponent implements OnInit {
//   voter: any;
//   electionsWithCandidates: any[] = [];
//   private APIUrl = "https://localhost:7181/api/Voter/";

//   constructor(private router: Router, private http: HttpClient) {
//     const navigation = this.router.getCurrentNavigation();
//     const state = navigation?.extras.state as { voter: any };
//     this.voter = state?.voter || {};
//   }

//   ngOnInit() {
//     if (!this.voter) {
//       alert('No voter data found! Redirecting to login page.');
//       this.router.navigate(['/register']);
//     } else {
//       this.loadActiveElectionsWithCandidates();
//     }
//   }

//   loadActiveElectionsWithCandidates() {
//     this.http.get(this.APIUrl + 'GetActiveElectionsWithCandidates/' + this.voter.voterId).subscribe(
//       (response: any) => {
//         this.electionsWithCandidates = response;
//         console.log(response);
//       },
//       (error) => {
//         console.error('Error loading elections and candidates:', error);
//         alert('Failed to load elections and candidates.');
//       }
//     );
//   console.log(this.voter.voterId);
 

//   }

//   navigateToVote(electionId: number, candidateId: number) {
//     console.log(electionId)
//     this.router.navigate(['/vote'], { state: { voterId: this.voter.voterId,electionId:electionId , candidateId: candidateId } });
//   }
// }
// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-voterdetails',
//   templateUrl: './voterdetails.component.html',
//   styleUrls: ['./voterdetails.component.css']
// })
// export class VoterdetailsComponent implements OnInit {
//   voter: any; // Voter details
//   electionsWithCandidates: any={}; // List of ongoing elections with their candidates
//   private APIUrl = "https://localhost:7181/api/Voter/";

//   constructor(private router: Router, private http: HttpClient) {
//     const navigation = this.router.getCurrentNavigation();
//     const state = navigation?.extras.state as { voter: any };
//     this.voter = state?.voter || {};
//   }

//   ngOnInit() {
//     if (!this.voter) {
//       alert('No voter data found! Redirecting to login page.');
//       this.router.navigate(['/register']);
//     } else {
//       this.loadActiveElectionsWithCandidates();
//     }
//   }

//   loadActiveElectionsWithCandidates() {
//     this.http.get(this.APIUrl + 'GetActiveElectionsWithCandidates/' + this.voter.VoterId).subscribe(
//       (response: any) => {
//         this.electionsWithCandidates = response;
//         console.log(response);
//       },
//       (error) => {
//         console.error('Error loading elections and candidates:', error);
//         alert('Failed to load elections and candidates.');
//       }
//     );
//   }

  
//   navigateToVote(election: any) {
//     if (election && election.candidates && election.candidates.length > 0) {
//       console.log(election,this.voter.voterId);
//       this.router.navigate(['/vote'], { state: { voterId: this.voter.VoterId, election: election.election.e_id } });
//     } else {
//       alert('No candidates available for this election.');
//     }
   
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { VoteService } from '../services/voting.service';

// @Component({
//   selector: 'app-voterdetails',
//   templateUrl: './voterdetails.component.html',
//   styleUrls: ['./voterdetails.component.css']
// })
// export class VoterdetailsComponent implements OnInit {
//   voter: any; // Voter details
//   electionsWithCandidates: any = {}; // List of ongoing elections with their candidates
//   private APIUrl = "https://localhost:7181/api/Voter/";

//   constructor(private router: Router, private http: HttpClient, private voteService: VoteService) {
//     const navigation = this.router.getCurrentNavigation();
//     const state = navigation?.extras.state as { voter: any };
//     this.voter = state?.voter || {};
//   }

//   ngOnInit() {
//     if (!this.voter) {
//       alert('No voter data found! Redirecting to login page.');
//       this.router.navigate(['/register']);
//     } else {
//       this.loadActiveElectionsWithCandidates();
//     }
//   }

//   loadActiveElectionsWithCandidates() {
//     this.http.get(this.APIUrl + 'GetActiveElectionsWithCandidates/' + this.voter.VoterId).subscribe(
//       (response: any) => {
//         this.electionsWithCandidates = response;
//         console.log(response);
//       },
//       (error) => {
//         console.error('Error loading elections and candidates:', error);
//         alert('Failed to load elections and candidates.');
//       }
//     );
//   }

//   navigateToVote(election: any) {
//     if (election && election.candidates && election.candidates.length > 0) {
//       this.voteService.setVoterDetails(this.voter.VoterId, election);  // Set voter details in the service
//       this.router.navigate(['/vote']);
//     } else {
//       alert('No candidates available for this election.');
//     }
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { VotingService } from '../services/voting.service';

// @Component({
//   selector: 'app-voterdetails',
//   templateUrl: './voterdetails.component.html',
//   styleUrls: ['./voterdetails.component.css']
// })
// export class VoterdetailsComponent implements OnInit {
//   voter: any; // Voter details
//   electionsWithCandidates: any[] = []; // List of ongoing elections with their candidates

//   constructor(private router: Router, private votingService: VotingService) {
//     const navigation = this.router.getCurrentNavigation();
//     const state = navigation?.extras.state as { voter: any };
//     this.voter = state?.voter || {};
//   }

//   ngOnInit() {
//     if (!this.voter || !this.voter.VoterId) {
//       alert('No voter data found! Redirecting to login page.');
//       this.router.navigate(['/register']);
//     } else {
//       this.loadActiveElectionsWithCandidates();
//     }
//   }

//   loadActiveElectionsWithCandidates() {
//     this.votingService.getAllElections().subscribe(
//       (elections: any[]) => {
//         // Filter to get ongoing elections
//         const currentDate = new Date();
//         const ongoingElections = elections.filter(e => new Date(e.startDate) <= currentDate && new Date(e.endDate) >= currentDate);
        
//         // Fetch candidates for each ongoing election
//         const electionWithCandidatesPromises = ongoingElections.map(election => 
//           this.votingService.getAllCandidates().toPromise().then(candidates => {
//             // Ensure candidates is not undefined and filter as needed
//             const filteredCandidates = candidates ? candidates.filter(candidate => 
//               election.candidates && election.candidates.includes(candidate.candidate_id)) : [];
//             return {
//               election,
//               candidates: filteredCandidates
//             };
//           })
//         );

//         Promise.all(electionWithCandidatesPromises).then(results => {
//           this.electionsWithCandidates = results;
//           console.log(this.electionsWithCandidates);
//         }).catch(error => {
//           console.error('Error processing elections and candidates:', error);
//           alert('Failed to process elections and candidates.');
//         });
//       },
//       (error) => {
//         console.error('Error loading elections:', error);
//         alert('Failed to load elections.');
//       }
//     );
//   }

//   navigateToVote(election: any) {
//     if (election && election.candidates && election.candidates.length > 0) {
//       this.votingService.setVoterDetails(this.voter.VoterId, election);  // Set voter details in the service
//       this.router.navigate(['/vote']);
//     } else {
//       alert('No candidates available for this election.');
//     }
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { VotingService } from '../services/voting.service';

// @Component({
//   selector: 'app-voterdetails',
//   templateUrl: './voterdetails.component.html',
//   styleUrls: ['./voterdetails.component.css']
// })
// export class VoterdetailsComponent implements OnInit {
//   voter: any; // Voter details
//   electionsWithCandidates: any[] = []; // List of ongoing elections with their candidates

//   constructor(private router: Router, private votingService: VotingService) {
//     const navigation = this.router.getCurrentNavigation();
//     const state = navigation?.extras.state as { voter: any };
//     this.voter = state?.voter || {};
//   }

//   ngOnInit() {
//     if (!this.voter || !this.voter.VoterId) {
//       alert('No voter data found! Redirecting to login page.');
//       this.router.navigate(['/register']);
//     } else {
//       this.loadActiveElectionsWithCandidates();
//     }
//   }

//   loadActiveElectionsWithCandidates() {
//     this.votingService.getAllElections().subscribe(
//       (elections: any[]) => {
//         const currentDate = new Date();
//         const ongoingElections = elections.filter(e => new Date(e.startDate) <= currentDate && new Date(e.endDate) >= currentDate);

//         // Assume `getCandidates` returns all candidates and filter them based on the election's candidate ids
//         this.votingService.getAllCandidates().subscribe(candidates => {
//           this.electionsWithCandidates = ongoingElections.map(election => ({
//             election,
//             candidates: candidates.filter(candidate => 
//               election.candidates && election.candidates.includes(candidate.candidate_id))
//           }));
//           console.log(this.electionsWithCandidates);
//         });
//       },
//       (error) => {
//         console.error('Error loading elections and candidates:', error);
//         alert('Failed to load elections and candidates.');
//       }
//     );
//   }

//   navigateToVote(election: any) {
//     if (election && election.candidates && election.candidates.length > 0) {
//       this.votingService.setVoterDetails(this.voter.VoterId, election); // Set voter details in the service
//       this.router.navigate(['/vote']);
//       console.log(this.voter.voterId)
//     } else {
//       alert('No candidates available for this election.');
//     }
//   }
//uncomment this 1.22
// castVote() {
  //   if (this.selectedElectionId !== null && this.selectedCandidateId !== null) {
  //     const voteRequest = {
  //       voterId: this.voter.voterId,
  //       electionid: this.selectedElectionId,
  //       candidateid: this.selectedCandidateId
  //     };
  //     console.log(voteRequest);
  //     console.log(this.voter);

  //     this.http.post<any>(this.APIUrl + 'CastVote', voteRequest).subscribe(
  //       (response) => {
  //         alert('Vote cast successfully!');
  //         this.selectedElectionId = null;
  //         this.selectedCandidateId = null;
  //         this.loadActiveElectionsWithCandidates(); // Refresh the list after voting
  //       },
  //       (error) => {
  //         console.error('Error casting vote:', error);
  //         alert('Error casting vote: ' + error.error.message);
  //       }
  //     );
  //   } else {
  //     alert('Please select both an election and a candidate.');
  //   }
  // }
 // castVote(candidateId: number) {
  //   const voteData = {
  //     voterId: this.voter.voterId,  // Ensure this is correctly set
  //     candidateId: candidateId,
  //     electionId: this.selectedElectionId
  //   };
  
  //   this.http.post('https://localhost:7181/api/Voter/CastVote', voteData)
  //     .subscribe(
  //       response => {
  //         console.log('Vote cast successfully!', response);
  //         alert(`Vote cast for candidate ID: ${candidateId}`);
  //       },
  //       error => {
  //         console.error('Error casting vote:', error);
  //       }
  //     );
  // }