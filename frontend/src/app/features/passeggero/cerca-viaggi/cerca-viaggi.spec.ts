import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CercaViaggi } from './cerca-viaggi';

describe('CercaViaggi', () => {
  let component: CercaViaggi;
  let fixture: ComponentFixture<CercaViaggi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CercaViaggi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CercaViaggi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
