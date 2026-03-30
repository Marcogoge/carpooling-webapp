import { Component, OnInit } from '@angular/core';
  import { Router, RouterLink } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { MatCardModule } from '@angular/material/card';
  import { MatButtonModule } from '@angular/material/button';
  import { ViaggioService } from '../../../core/services/viaggio.service';
  import { AuthService } from '../../../core/services/auth.service';
 
  @Component({
    selector: 'app-dashboard-autista',
    standalone: true,
    imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
    templateUrl: './dashboard-autista.html'
  })
  export class DashboardAutistaComponent implements OnInit {
    viaggi: any[] = [];
    utente: any;
 
    constructor(
      private vs: ViaggioService,
      private auth: AuthService,
      private router: Router
    ) {}
 
    ngOnInit() {
      this.utente = this.auth.getUtente();
      if (!this.utente) { this.router.navigate(['/login']); return; }
      this.vs.getViaggi().subscribe((res: any) => {
        this.viaggi = res.dati.filter((v: any) =>
          v.id_autista == this.utente.id);
      });
    }
 
    vaiPrenotazioni(id: number) {
      this.router.navigate(['/autista/prenotazioni', id]);
    }
 
    elimina(id: number) {
      if (!confirm('Eliminare questo viaggio?')) return;
      this.vs.eliminaViaggio(id).subscribe(() => {
        this.viaggi = this.viaggi.filter(v => v.id_viaggio !== id);
      });
    }
  }