import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPasseggero } from './register-passeggero';

describe('RegisterPasseggero', () => {
  let component: RegisterPasseggero;
  let fixture: ComponentFixture<RegisterPasseggero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterPasseggero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPasseggero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
