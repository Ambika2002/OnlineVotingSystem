import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { VotersComponent } from './voters/voters.component';
import { CandidatesComponent } from './candidates/candidates.component';
import { ElectionsComponent } from './elections/elections.component';
import { FormsModule } from '@angular/forms';
import { VoterdetailsComponent } from './voterdetails/voterdetails.component';
import { VoteComponent } from './vote/vote.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ElectionresultComponent } from './electionresult/electionresult.component';
import { IndexComponent } from './index/index.component';
import { ElectionsviewComponent } from './electionsview/electionsview.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    VotersComponent,
    CandidatesComponent,
    ElectionsComponent,
    VoterdetailsComponent,
    VoteComponent,
    DashboardComponent,
    ElectionresultComponent,
    IndexComponent,
    ElectionsviewComponent, 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
