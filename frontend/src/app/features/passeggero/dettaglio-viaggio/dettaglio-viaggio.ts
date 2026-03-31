  import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { MatButtonModule } from '@angular/material/button';
  import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
  import { ViaggioService } from '../../../core/services/viaggio.service';
  import { PrenotazioneService } from '../../../core/services/prenotazione.service';
  import { FeedbackService } from '../../../core/services/feedback.service';
  import { AuthService } from '../../../core/services/auth.service';
 
  @Component({
    selector: 'app-dettaglio-viaggio',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule],
    templateUrl: './dettaglio-viaggio.html'
  })
  export class DettaglioViaggioComponent implements OnInit {
    viaggio: any = null;
    feedback: any[] = [];
    caricamento = true;
    messaggio = '';
    errore = '';
    utente: any;
 
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private vs: ViaggioService,
      private ps: PrenotazioneService,
      private fs: FeedbackService,
      private auth: AuthService
    ) {}
 
    ngOnInit() {
      this.utente = this.auth.getUtente();
      const id = +this.route.snapshot.paramMap.get('id')!;
      if (!id) { this.router.navigate(['/passeggero/cerca']); return; }
      this.vs.getViaggio(id).subscribe({
        next: (res: any) => {
          this.viaggio = res.dati;
          this.caricamento = false;
        },
        error: () => {
          this.caricamento = false;
          this.errore = 'Viaggio non trovato.';
        }
      });
      this.fs.getFeedbackAutista(id)
        .subscribe({ next: (res: any) => this.feedback = res.dati });
    }
 
    prenota() {
      if (!this.utente) { this.router.navigate(['/login']); return; }
      this.ps.prenota(this.viaggio.id_viaggio, this.utente.id).subscribe({
        next: () => this.messaggio = 'Prenotazione inviata. Attendi conferma.',
        error: (e: any) => this.errore = e.error?.errore ?? 'Errore'
      });
    }
 
    indietro() { this.router.navigate(['/passeggero/cerca']); }
 
    isPiena(s: number, v: number|null) {
      return v !== null && s <= Math.round(v);
    }
  }