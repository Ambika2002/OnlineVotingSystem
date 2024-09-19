import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-electioncandidates',
  templateUrl: './electioncandidates.component.html',
  styleUrls: ['./electioncandidates.component.css'] // Corrected 'styleUrl' to 'styleUrls'
})
export class ElectionCandidatesComponent implements OnInit {
  private APIUrl = "https://localhost:7181/api/Admin/";

  candidates: any = [];
  elections: any = [];
  selectedElectionId: number = 0;
  selectedCandidateId: number = 0;
  electionCandidates: any = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadElectionCandidates();
    this.loadElections();
    this.loadCandidates();
  }

  loadElectionCandidates() {
    this.http.get(this.APIUrl + "GetAllElectionCandidates").subscribe(data => {
      this.electionCandidates = data;
      console.log(this.electionCandidates);
    });
  }

  // Load all elections for the dropdown
  loadElections() {
    this.http.get(this.APIUrl + "GetAllElections").subscribe(data => {
      this.elections = data;
    });
  }

  // Load all candidates for the dropdown
  loadCandidates() {
    this.http.get(this.APIUrl + "GetAllCandidates").subscribe(data => {
      this.candidates = data;
    });
  }

  // Add Candidate to Election with backend response handling
  addCandidateToElection() {
    if (this.selectedElectionId > 0 && this.selectedCandidateId > 0) {
      this.http.post(this.APIUrl + `InsertCandidateinElection/${this.selectedElectionId}/${this.selectedCandidateId}`, {})
        .subscribe(
          (response: any) => {
            alert("Candidate Added successfully");
            this.loadElectionCandidates();
            // Show the message from the backend response
          },
          (error) => {
            //console.error('Error adding candidate:', error);
            if (error.status === 409) { // Conflict Error - Candidate already exists
              alert('Candidate is already part of the election.');
            } 
           // else {
            //   alert('Error adding candidate: ' + (error.error.message || 'Unknown error'));
            // }
          }
        );
    } else {
      alert('Please select both a candidate and an election.');
    }
  }

  // Delete Candidate from Election
  deleteCandidateFromElection(electionId: number, candidateId: number) {
    if (confirm('Are you sure you want to delete this candidate from the election?')) {
      this.http.delete(this.APIUrl + `RemoveCandidatefromElection/${electionId}/${candidateId}`,{}).subscribe(
        (response: any) => {
          alert('Candidate deleted successfully!');
          this.loadElectionCandidates();

        },
        (error) => {
          // console.error('Error deleting candidate:', error);
          alert('Error deleting candidate: ' + (error.error.message || 'Unknown error'));
        }
      );
    }
  }
}




















// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-electioncandidates',
//   templateUrl: './electioncandidates.component.html',
//   styleUrl: './electioncandidates.component.css'
// })
// export class ElectionCandidatesComponent implements OnInit {
//   private APIUrl = "https://localhost:7181/api/Admin/";

//   candidates: any = [];
//   elections: any = [];
//   selectedElectionId: number = 0;
//   selectedCandidateId: number = 0;

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     this.loadElections();
//     this.loadCandidates();
//   }

//   // Load all elections for the dropdown
//   loadElections() {
//     this.http.get(this.APIUrl + "GetAllElections").subscribe(data => {
//       this.elections = data;
//     });
//   }

//   // Load all candidates for the dropdown
//   loadCandidates() {
//     this.http.get(this.APIUrl + "GetAllCandidates").subscribe(data => {
//       this.candidates = data;
//     });
//   }

//   // Add Candidate to Election
//   addCandidateToElection() {
//     if (this.selectedElectionId > 0 && this.selectedCandidateId > 0) {
//       this.http.post(this.APIUrl + `InsertCandidateinElection/${this.selectedElectionId}/${this.selectedCandidateId}`, {}).subscribe(
//         (response: any) => {
//           alert('Candidate added successfully!');
//         },
//         (error) => {
//           console.error('Error adding candidate:', error);
//           alert('Error adding candidate: ' + (error.error.message || 'Unknown error'));
//         }
//       );
//     } else {
//       alert('Please select both a candidate and an election.');
//     }
//   }

//   // Delete Candidate from Election
//   deleteCandidateFromElection(electionId: number, candidateId: number) {
//     if (confirm('Are you sure you want to delete this candidate from the election?')) {
//       this.http.delete(this.APIUrl + `DeleteCandidateFromElection/${electionId}/${candidateId}`).subscribe(
//         (response: any) => {
//           alert('Candidate deleted successfully!');
//         },
//         (error) => {
//           console.error('Error deleting candidate:', error);
//           alert('Error deleting candidate: ' + (error.error.message || 'Unknown error'));
//         }
//       );
//     }
//   }

// }
