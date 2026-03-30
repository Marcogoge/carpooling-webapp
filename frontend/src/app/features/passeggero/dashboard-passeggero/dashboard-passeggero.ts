import { Component, OnInit } from '@angular/core';
  import { Router, RouterLink } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { MatCardModule } from '@angular/material/card';
  import { MatButtonModule } from '@angular/material/button';
  import { PrenotazioneService } from '../../../core/services/prenotazione.service';
  import { AuthService } from '../../../core/services/auth.service';
 
  @Component({
    selector: 'app-dashboard-passeggero',
    standalone: true,
    imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
    templateUrl: './dashboard-passeggero.html'
  })
  export class DashboardPasseggeroComponent implements OnInit {
    prenotazioni: any[] = [];
    utente: any;
 
    constructor(
      private ps: PrenotazioneService,
      private auth: AuthService,
      private router: Router
    ) {}
 
    ngOnInit() {
      this.utente = this.auth.getUtente();
      if (!this.utente) { this.router.navigate(['/login']); return; }
      this.ps.getMiePrenotazioni(this.utente.id)
        .subscribe((res: any) => this.prenotazioni = res.dati);
    }
  }