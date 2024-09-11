import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestedComponent } from './leave-requested.component';

describe('LeaveRequestedComponent', () => {
  let component: LeaveRequestedComponent;
  let fixture: ComponentFixture<LeaveRequestedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRequestedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveRequestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
