import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionsviewComponent } from './electionsview.component';

describe('ElectionsviewComponent', () => {
  let component: ElectionsviewComponent;
  let fixture: ComponentFixture<ElectionsviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElectionsviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectionsviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
