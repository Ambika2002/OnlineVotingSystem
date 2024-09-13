import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ms-app5';
  private APIUrl = "https://localhost:7181/api/Admin/";

  voters: any = [];
  candidates: any = [];
  elections: any = [];

  voterInfo = {
    id:"",
    votid:"",
    name:"",
    email:"",
    passwordhash:"",
    hasvoted:""
  };

  candidateInfo = {
    candidateName: "",
    party: ""
  };

  electionInfo = {
    electionName: "",
    description: "",
    startDate: new Date(),
    endDate: new Date()
  };

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.refreshVoters();
    this.refreshCandidates();
    this.refreshElections();
  }

  // Voters CRUD Operations

  refreshVoters() {
    this.http.get(this.APIUrl + "GetAllVoters").subscribe(data => {
      this.voters = data;
    });
  }

  addVoter() {
    this.http.post(this.APIUrl + 'AddVoter', this.voterInfo).subscribe(data => {
      alert(data);
      this.refreshVoters();
    });
  }

  updateVoter(id: any) {
    this.voterInfo.name = (<HTMLInputElement>document.getElementById("voterName")).value;
    this.http.put(this.APIUrl + "UpdateVoter/" + id, this.voterInfo).subscribe(data => {
      alert(data);
      this.refreshVoters();
    });
  }

  deleteVoter(id: any) {
    this.http.delete(this.APIUrl + "DeleteVoter?voterId=" + id).subscribe(data => {
      alert(data);
      this.refreshVoters();
    });
  }

  // Candidates CRUD Operations

  refreshCandidates() {
    this.http.get(this.APIUrl + "GetAllCandidates").subscribe(data => {
      this.candidates = data;
    });
  }

  addCandidate() {
    this.http.post(this.APIUrl + 'AddCandidate', this.candidateInfo).subscribe(data => {
      alert(data);
      this.refreshCandidates();
    });
  }

  updateCandidate(id: any) {
    this.candidateInfo.candidateName = (<HTMLInputElement>document.getElementById("candidateName")).value;
    this.http.put(this.APIUrl + "UpdateCandidate/" + id, this.candidateInfo).subscribe(data => {
      alert(data);
      this.refreshCandidates();
    });
  }

  deleteCandidate(id: any) {
    this.http.delete(this.APIUrl + "DeleteCandidate?candidateId=" + id).subscribe(data => {
      alert(data);
      this.refreshCandidates();
    });
  }

  // Elections CRUD Operations

  refreshElections() {
    this.http.get(this.APIUrl + "GetAllElections").subscribe(data => {
      this.elections = data;
    });
  }

  addElection() {
    this.http.post(this.APIUrl + 'AddElection', this.electionInfo).subscribe(data => {
      alert(data);
      this.refreshElections();
    });
  }

  updateElection(id: any) {
    this.electionInfo.electionName = (<HTMLInputElement>document.getElementById("electionName")).value;
    this.http.put(this.APIUrl + "UpdateElection/" + id, this.electionInfo).subscribe(data => {
      alert(data);
      this.refreshElections();
    });
  }

  deleteElection(id: any) {
    this.http.delete(this.APIUrl + "DeleteElection?electionId=" + id).subscribe(data => {
      alert(data);
      this.refreshElections();
    });
  }
}
