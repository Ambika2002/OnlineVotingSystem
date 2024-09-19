import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

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

  constructor(private router: Router, private http: HttpClient,private authService:AuthService) {
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
        //console.log('Response from API:', response.hasVoted);  // Log response to verify structure
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
       // console.log('Response from API:', response);  // Log response to verify structure
        this.electionsWithCandidates = response;
      },
      (error) => {
        console.error('Error loading elections and candidates:', error);
        alert('Failed to load elections and candidates.');
      }
    );
  }

  logout() {
    this.authService.logout(); 
  }
  selectElection(electionId: number) {
    this.selectedElectionId = electionId;
   // console.log('Selected Election ID:', this.selectedElectionId);  // Debugging line
  }

  selectCandidate(candidateId: number) {
    this.selectedCandidateId = candidateId;
    //console.log('Selected Candidate ID:', this.selectedCandidateId);  // Debugging line
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
          alert(`Vote cast for candidate ID: ${this.selectedCandidateId}`);
          this.selectedElectionId = null;
          this.selectedCandidateId = null;
          this.VotingStatus();
          this.loadActiveElectionsWithCandidates();
          this.logout();
          
          // Refresh the list after voting
          this.refreshPage();
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
refreshPage() {
      
  this.ngOnInit(); 
}
  }
  




