  import { Component, OnInit } from '@angular/core';
  import { Router, RouterLink } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { MatButtonModule } from '@angular/material/button';
  import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
  import { PrenotazioneService } from '../../../core/services/prenotazione.service';
  import { AuthService } from '../../../core/services/auth.service';
 
  @Component({
    selector: 'app-dashboard-passeggero', standalone: true,
    imports: [CommonModule, RouterLink, MatButtonModule, MatProgressSpinnerModule],
    templateUrl: './dashboard-passeggero.html'
  })
  export class DashboardPasseggeroComponent implements OnInit {
    prenotazioni: any[] = []; caricamento = true; utente: any;
 
    constructor(
      private ps: PrenotazioneService,
      private auth: AuthService,
      private router: Router
    ) {}
 
    ngOnInit() {
      this.utente = this.auth.getUtente();
      if (!this.utente) { this.router.navigate(['/login']); return; }
      this.ps.getMiePrenotazioni(this.utente.id).subscribe({
        next: (r: any) => { this.prenotazioni = r.dati || []; this.caricamento = false; },
        error: () => this.caricamento = false
      });
    }
 
    lasiciaFeedback(idViaggio: number, idAutista: number) {
      this.router.navigate(['/feedback'], {
        queryParams: {
          tipo:           'per_autista',
          id_viaggio:     idViaggio,
          // id_autista e passato direttamente dalla prenotazione
          id_destinatario: idAutista
        }
      });
    }
  }