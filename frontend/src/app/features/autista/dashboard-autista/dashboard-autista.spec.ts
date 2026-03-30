import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAutista } from './dashboard-autista';

describe('DashboardAutista', () => {
  let component: DashboardAutista;
  let fixture: ComponentFixture<DashboardAutista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardAutista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAutista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
