import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-voters',
  templateUrl: './voters.component.html',
  styleUrl: './voters.component.css'
})
export class VotersComponent implements OnInit {
  private APIUrl = "https://localhost:7181/api/Admin/";

  voters: any = [];

  isEditMode = false;
  selectedVoter: any = {};

  voterInfo = {
    id:"",
    votid:"",
    name:"",
    email:"",
    passwordhash:"",
    votingStatus:""
  };
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.refreshVoters();
  }

  // Voters CRUD Operations

  refreshVoters() {
    this.http.get(this.APIUrl + "GetAllVoters").subscribe(data => {
      this.voters = data;
    });
  }
  editVoter(voter: any) {
    this.isEditMode = true;
    this.selectedVoter = { ...voter }; // Create a copy to avoid mutating the original
  }

  updateVoter() {
    if (this.selectedVoter.votId && this.selectedVoter.email) {
      this.http
        .put(this.APIUrl + `UpdateVoter/${this.selectedVoter.id}/${this.selectedVoter.email}`, {})
        .subscribe(
          (response: any) => {
            alert('Voter updated successfully!');
            this.refreshVoters(); // Refresh the list after update
            this.isEditMode = false; // Exit edit mode
          },
          (error) => {
            console.error('Error updating voter:', error);
            alert('Error updating voter: ' + (error.error.message || 'Unknown error'));
          }
        );
    } else {
      alert('Please enter valid voter details.');
    }
  }

  deleteVoter(voterId: any) {
    if (confirm('Are you sure you want to delete this voter?')) {
      this.http.delete(this.APIUrl + 'DeleteVoter/' + voterId).subscribe(
        (response: any) => {
          alert('Voter deleted successfully!');
          this.refreshVoters(); // Refresh the list after deletion
        },
        (error) => {
          console.error('Error deleting voter:', error);
          alert('Error deleting voter: ' + (error.error.message || 'Unknown error'));
        }
      );
    }
  }

  cancelEdit() {
    this.isEditMode = false;
    this.selectedVoter = {}; // Clear selected voter
  }
}
