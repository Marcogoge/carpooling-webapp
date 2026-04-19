import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ViaggioService } from '../../../core/services/viaggio.service';
import { AuthService } from '../../../core/services/auth.service';
import { SumPipe } from '../../../core/services/pipes/sum.pipe';
@Component({
  selector: 'app-dashboard-autista', standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatProgressSpinnerModule, SumPipe],
  templateUrl: './dashboard-autista.html'
})
export class DashboardAutistaComponent implements OnInit {
  viaggi: any[] = []; caricamento = true; utente: any;
  constructor(
    private vs: ViaggioService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.utente = this.auth.getUtente();
    if (!this.utente || this.utente.tipo !== 'autista') {
      this.router.navigate(['/login']); return;
    }
    this.vs.getViaggi().subscribe({
      next: (r: any) => {
        this.viaggi = (r.dati || []).filter((v: any) => +v.id_autista === +this.utente.id)
;
        this.caricamento = false;
        this.cdr.detectChanges(); // FIX
      },
      error: () => { this.caricamento = false; this.cdr.detectChanges(); }
    });
  }
  vaiPrenotazioni(id: number) { this.router.navigate(['/autista/prenotazioni', id]); }
  elimina(id: number) {
    if (!confirm('Eliminare questo viaggio?')) return;
    this.vs.eliminaViaggio(id).subscribe(() => {
      this.viaggi = this.viaggi.filter(v => v.id_viaggio !== id);
      this.cdr.detectChanges(); // FIX
    });
  }
}