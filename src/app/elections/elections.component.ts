import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-elections',
  templateUrl: './elections.component.html',
  styleUrls: ['./elections.component.css'] // Corrected `styleUrl` to `styleUrls`
})
export class ElectionsComponent implements OnInit {
  private APIUrl = "https://localhost:7181/api/Admin/";

  elections: any = [];
  isEditMode = false;
  selectedElection: any = {};

  electionInfo = {
    e_Id: "",
    name: "",
    description: "",
    startDate: "",
    endDate: ""
  };

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.refreshElections();
  }

  // Elections CRUD Operations

  refreshElections() {
    this.http.get(this.APIUrl + "GetAllElections").subscribe(data => {
      this.elections = data;
    });
  }

  addElection() {
    const electionPayload = {
      name: this.electionInfo.name,
      description: this.electionInfo.description,
      startDate: this.electionInfo.startDate,
      endDate: this.electionInfo.endDate
    };
  
    if (electionPayload.name && electionPayload.description && electionPayload.startDate && electionPayload.endDate) {
      this.http.post(this.APIUrl + "AddElection", electionPayload).subscribe(
        (response: any) => {
          alert('Election added successfully!');
          this.refreshElections(); // Refresh the list after addition
          this.electionInfo = { e_Id: "", name: "", description: "", startDate: "", endDate: "" }; // Clear form
        },
        (error) => {
          console.error('Error adding election:', error);
          alert('Error adding election: ' + (error.error.title || 'Unknown error'));
        }
      );
    } else {
      alert('Please enter valid election details.');
    }
  }
  
  
  editElection(election: any) {
    this.isEditMode = true;
    this.selectedElection = { ...election }; // Create a copy to avoid mutating the original
  }

  updateElectionDate() {
    if (this.selectedElection.e_Id && this.selectedElection.startDate&& this.selectedElection.endDate ) {
    this.http.put(this.APIUrl + `UpdateElectionDate/${this.selectedElection.e_Id}/${this.selectedElection.startDate}/${this.selectedElection.endDate}`, {}).subscribe(
        (response: any) => {
          alert('Election updated successfully!');
          this.refreshElections(); // Refresh the list after update
          this.isEditMode = false; // Exit edit mode
        },
        (error) => {
          console.error('Error updating election:', error);
          alert('Error updating election: ' + (error.error.message || 'Unknown error'));
        }
      );
    } else {
      alert('Please enter valid election details.');
    }
  }
  updateElectionDetails() {
    if (this.selectedElection.e_Id && this.selectedElection.name && this.selectedElection.description ) {
    this.http.put(this.APIUrl + `UpdateElectionDetails/${this.selectedElection.e_Id}/${this.selectedElection.name}/${this.selectedElection.description}`, {}).subscribe(
        (response: any) => {
          alert('Election updated successfully!');
          this.refreshElections(); // Refresh the list after update
          this.isEditMode = false; // Exit edit mode
        },
        (error) => {
          console.error('Error updating election:', error);
          alert('Error updating election: ' + (error.error.message || 'Unknown error'));
        }
      );
    } else {
      alert('Please enter valid election details.');
    }
  }


  deleteElection(electionId: any) {
    if (confirm('Are you sure you want to delete this election?')) {
      this.http.delete(this.APIUrl + 'DeleteElection/' + electionId).subscribe(
        (response: any) => {
          alert('Election deleted successfully!');
          this.refreshElections(); // Refresh the list after deletion
        },
        (error) => {
          console.error('Error deleting election:', error);
          alert('Error deleting election: ' + (error.error.message || 'Unknown error'));
        }
      );
    }
  }
}
