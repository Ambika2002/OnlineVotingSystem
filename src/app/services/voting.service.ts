import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VotingService {
  private APIUrl = 'https://localhost:7181/api/Voter/';
  private voterId: string | null = null;
  private election: any = null;

  constructor(private http: HttpClient) { }

  // Method to set voter and election details
  setVoterDetails(voterId: string, election: any) {
    this.voterId = voterId;
    this.election = election;
  }

  // Method to get voterId
  getVoterId() {
    return this.voterId;
  }

  // Method to get election
  getElection() {
    return this.election;
  }

  // Method to check if the voter has already voted
  hasVoted(voterId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.APIUrl}HasVoted/${voterId}`);
  }

  // Method to fetch all candidates
  getAllCandidates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.APIUrl}GetAllCandidates`);
  }

  // Method to fetch all elections
  getAllElections(): Observable<any[]> {
    return this.http.get<any[]>(`${this.APIUrl}GetAllElect`);
  }

  // Method to cast a vote for a specific candidate
  castVote(voteRequest: { voterId: string; electionid: number; candidateid: number }): Observable<any> {
    return this.http.post<any>(`${this.APIUrl}CastVote`, voteRequest);
  }
}
