import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute, Router, RouterLink } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { MatCardModule } from '@angular/material/card';
  import { MatButtonModule } from '@angular/material/button';
  import { ViaggioService } from '../../../core/services/viaggio.service';
  import { PrenotazioneService } from '../../../core/services/prenotazione.service';
  import { FeedbackService } from '../../../core/services/feedback.service';
  import { AuthService } from '../../../core/services/auth.service';
 
  @Component({
    selector: 'app-dettaglio-viaggio',
    standalone: true,
    imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
    templateUrl: './dettaglio-viaggio.html'
  })
  export class DettaglioViaggioComponent implements OnInit {
    viaggio: any = null;
    feedback: any[] = [];
    messaggio = ''; errore = '';
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
      this.vs.getViaggio(id).subscribe((res: any) => this.viaggio = res.dati);
      this.fs.getFeedbackAutista(id)
        .subscribe((res: any) => this.feedback = res.dati);
    }
 
    prenota() {
      if (!this.utente) { this.router.navigate(['/login']); return; }
      this.ps.prenota(this.viaggio.id_viaggio, this.utente.id).subscribe({
        next: () => this.messaggio = 'Prenotazione inviata! Attendi conferma.',
        error: (e: any) => this.errore = e.error?.errore ?? 'Errore'
      });
    }
  }