import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionCandidatesComponent } from './electioncandidates.component';

describe('ElectioncandidatesComponent', () => {
  let component: ElectionCandidatesComponent;
  let fixture: ComponentFixture<ElectionCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElectionCandidatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectionCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
