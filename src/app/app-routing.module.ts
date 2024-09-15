import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VotersComponent } from './voters/voters.component';
import { CandidatesComponent } from './candidates/candidates.component';
import { ElectionsComponent } from './elections/elections.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { VoterdetailsComponent } from './voterdetails/voterdetails.component';
import { VoteComponent } from './vote/vote.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ElectionresultComponent } from './electionresult/electionresult.component';
import { IndexComponent } from './index/index.component';
import { ElectionsviewComponent } from './electionsview/electionsview.component';

const routes: Routes = [
  { path: 'home', component: IndexComponent },
  { path: 'electionsview', component: ElectionsviewComponent },
  { path: 'voters', component: VotersComponent },
  { path: 'candidates', component: CandidatesComponent },
  { path: 'elections', component: ElectionsComponent },
  {path:'register', component:RegisterComponent},
  {path:'voterdetails', component:VoterdetailsComponent},
  {path:'vote', component:VoteComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, 
  {path:'login',component:LoginComponent},
  {path:'results',component:ElectionresultComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
  // Default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

