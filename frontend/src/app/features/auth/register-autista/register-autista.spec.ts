import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAutista } from './register-autista';

describe('RegisterAutista', () => {
  let component: RegisterAutista;
  let fixture: ComponentFixture<RegisterAutista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterAutista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterAutista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
