import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PrenotazioneService } from '../../../core/services/prenotazione.service';
import { ViaggioService } from '../../../core/services/viaggio.service';
import { AuthService } from '../../../core/services/auth.service';
@Component({
selector: 'app-dashboard-passeggero', standalone: true,
imports: [CommonModule, RouterLink, MatButtonModule, MatProgressSpinnerModule],
templateUrl: './dashboard-passeggero.html'
})
export class DashboardPasseggeroComponent implements OnInit {
prenotazioni: any[] = [];
viaggiSuggeriti: any[] = [];
caricamento = true; utente: any;
get prenotazioniAccettate() {
return this.prenotazioni.filter(p => p.stato === 'accettata');
}
get prenotazioniAttesa() {
return this.prenotazioni.filter(p => p.stato === 'attesa');
}
get prenotazioniRifiutate() {
return this.prenotazioni.filter(p => p.stato === 'rifiutata');
}
constructor(
private ps: PrenotazioneService, private vs: ViaggioService,
private auth: AuthService, private router: Router,
private cdr: ChangeDetectorRef
) {}
ngOnInit() {
this.utente = this.auth.getUtente();
if (!this.utente) { this.router.navigate(['/login']); return; }
this.ps.getMiePrenotazioni(this.utente.id).subscribe({
next: (r: any) => {
this.prenotazioni = r.dati || [];
this.caricamento = false;
this.cdr.detectChanges();
},
error: () => { this.caricamento = false; this.cdr.detectChanges(); }});
this.vs.getViaggi().subscribe({
next: (r: any) => {
this.viaggiSuggeriti = (r.dati || []).slice(0, 3);
this.cdr.detectChanges();
}
});
}
lasiciaFeedback(idViaggio: number, idAutista: number) {
this.router.navigate(['/feedback'], {
queryParams: { tipo:'per_autista', id_viaggio:idViaggio, id_destinatario:idAutista }
});
}
isPiena(s: number, v: number|null) { return v !== null && s <= Math.round(v); }
}
