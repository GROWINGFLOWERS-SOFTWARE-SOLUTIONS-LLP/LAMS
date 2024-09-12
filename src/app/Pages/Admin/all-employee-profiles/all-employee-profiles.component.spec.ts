import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEmployeeProfilesComponent } from './all-employee-profiles.component';

describe('AllEmployeeProfilesComponent', () => {
  let component: AllEmployeeProfilesComponent;
  let fixture: ComponentFixture<AllEmployeeProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllEmployeeProfilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllEmployeeProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
