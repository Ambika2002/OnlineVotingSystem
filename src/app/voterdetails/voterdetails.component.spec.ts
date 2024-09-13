import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoterdetailsComponent } from './voterdetails.component';

describe('VoterdetailsComponent', () => {
  let component: VoterdetailsComponent;
  let fixture: ComponentFixture<VoterdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoterdetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoterdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
