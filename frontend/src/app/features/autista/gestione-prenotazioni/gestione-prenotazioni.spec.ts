import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionePrenotazioni } from './gestione-prenotazioni';

describe('GestionePrenotazioni', () => {
  let component: GestionePrenotazioni;
  let fixture: ComponentFixture<GestionePrenotazioni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionePrenotazioni]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionePrenotazioni);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
