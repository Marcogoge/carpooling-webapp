import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PrenotazioneService } from '../../../core/services/prenotazione.service';
import { AuthService } from '../../../core/services/auth.service';
import { ViaggioService } from '../../../core/services/viaggio.service'; // <-- AGGIUNGI

@Component({
  selector: 'app-dashboard-passeggero', standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './dashboard-passeggero.html'
})
export class DashboardPasseggeroComponent implements OnInit {
  prenotazioni: any[] = [];
  viaggiDisponibili: any[] = []; // <-- AGGIUNGI
  caricamento = true; utente: any;

  constructor(
    private ps: PrenotazioneService,
    private auth: AuthService,
    private router: Router,
    private vs: ViaggioService,  // <-- AGGIUNGI
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.utente = this.auth.getUtente();
    if (!this.utente) { this.router.navigate(['/login']); return; }

    // carica le prenotazioni (già c'era)
    this.ps.getMiePrenotazioni(this.utente.id).subscribe({
      next: (r: any) => {
        this.prenotazioni = r.dati || [];
        this.caricamento = false;
        this.cdr.detectChanges();
      },
      error: () => { this.caricamento = false; this.cdr.detectChanges(); }
    });

    // carica i viaggi disponibili (AGGIUNGI)
    this.vs.getViaggi().subscribe({
      next: (r: any) => {
        this.viaggiDisponibili = (r.dati || []).slice(0, 6); // mostra max 6
        this.cdr.detectChanges();
      }
    });
  }

  vai(id: number) { this.router.navigate(['/passeggero/viaggio', id]); }

  lasiciaFeedback(idViaggio: number, idAutista: number) {
    this.router.navigate(['/feedback'], {
      queryParams: { tipo: 'per_autista', id_viaggio: idViaggio, id_destinatario: idAutista }
    });
  }
}