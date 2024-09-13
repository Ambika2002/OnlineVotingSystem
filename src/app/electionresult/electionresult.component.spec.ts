import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionresultComponent } from './electionresult.component';

describe('ElectionresultComponent', () => {
  let component: ElectionresultComponent;
  let fixture: ComponentFixture<ElectionresultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElectionresultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectionresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
