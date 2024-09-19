
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css'] 
})
export class CandidatesComponent implements OnInit {
  private APIUrl = "https://localhost:7181/api/Admin/";

  candidates: any = [];
  isEditMode = false;
  selectedCandidate: any = {};

  candidateInfo = {
    candidate_id: "",
    name: "",
    party: "",
    totalVotes: ""
  };

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.refreshCandidates();
  }

  // Candidates CRUD Operations

  refreshCandidates() {
    this.http.get(this.APIUrl + "GetAllCandidates").subscribe(data => {
      this.candidates = data;
    });
  }

  addCandidate() {
      this.http
        .post(this.APIUrl + `AddCandidate/${this.candidateInfo.name}/${this.candidateInfo.party}`, {})
        .subscribe(
          (response: any) => {
            alert('Candidate Added successfully!');
            this.refreshCandidates(); // Refresh the list after update
            this.isEditMode = false; // Exit edit mode
          },
          (error) => {
            console.error('Error updating candidate:', error);
            alert('Error updating candidate: ' + (error.error.message || 'Unknown error'));
          }
        );
  }
  editCandidate(candidate: any) {
    this.isEditMode = true;
    this.selectedCandidate = { ...candidate }; // Create a copy to avoid mutating the original
  }

  updateCandidate() {
    console.log('Candidate ID:', this.selectedCandidate.candidate_id);
    console.log('Party:', this.selectedCandidate.party);
  
    if (this.selectedCandidate.candidate_id && this.selectedCandidate.party) {
      this.http
        .put(this.APIUrl + `UpdateCandidate/${this.selectedCandidate.candidate_id}/${this.selectedCandidate.party}`, {})
        .subscribe(
          (response: any) => {
            alert('Record updated successfully!');
            this.refreshCandidates(); // Refresh the list after update
            this.isEditMode = false; // Exit edit mode
          },
          (error) => {
            console.error('Error updating candidate record:', error);
            alert('Error updating candidate: ' + (error.error?.message || 'Unknown error'));
          }
        );
    } else {
      alert('Please enter valid candidate details.');
    }
  }
  

  deleteCandidate(candidateId: any) {
    if (confirm('Are you sure you want to delete this candidate?')) {
      this.http.delete(this.APIUrl + 'DeleteCandidate/' + candidateId).subscribe(
        (response: any) => {
          alert('Candidate deleted successfully!');
          this.refreshCandidates(); // Refresh the list after deletion
        },
        (error) => {
          console.error('Error deleting candidate:', error);
          alert('Error deleting candidate: ' + (error.error.message || 'The candidate is part of an election, record is not allowed to be deleted'));
        }
      );
    }
  }
}

