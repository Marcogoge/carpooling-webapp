import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPasseggero } from './dashboard-passeggero';

describe('DashboardPasseggero', () => {
  let component: DashboardPasseggero;
  let fixture: ComponentFixture<DashboardPasseggero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardPasseggero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPasseggero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
