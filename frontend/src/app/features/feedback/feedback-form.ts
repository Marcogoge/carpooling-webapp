import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FeedbackService } from '../../core/services/feedback.service';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-feedback-form', standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule
],
  templateUrl: './feedback-form.html'
})
export class FeedbackFormComponent implements OnInit {
  voto = 0; giudizio = ''; messaggio = ''; errore = '';
  caricamento = false; tipo = ''; idViaggio = 0; idDestination = 0; utente: any;
  constructor(
    private route: ActivatedRoute, private router: Router,
    private fs: FeedbackService, private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.utente = this.auth.getUtente();
    if (!this.utente) { this.router.navigate(['/login']); return; }
    this.tipo          = this.route.snapshot.queryParams['tipo'];
    this.idViaggio     = +this.route.snapshot.queryParams['id_viaggio'];
    this.idDestination = +this.route.snapshot.queryParams['id_destinatario'];
  }
  setVoto(v: number) { this.voto = v; this.cdr.detectChanges(); }
  invia() {
    if (this.voto < 1 || this.voto > 5) { this.errore = 'Seleziona un voto da 1 a 5'; return; }
    this.caricamento = true; this.errore = '';
    const payload: any = {
      voto: this.voto, giudizio: this.giudizio,
      id_viaggio: this.idViaggio, tipo_feedback: this.tipo,
    };
    if (this.utente.tipo === 'passeggero') payload.id_autore_passeggero = this.utente.id;
    else payload.id_autore_autista = this.utente.id;
    if (this.tipo === 'per_autista') payload.id_destinatario_autista = this.idDestination;
    else payload.id_destinatario_passeggero = this.idDestination;
    this.fs.invia(payload).subscribe({
      next: () => {
        this.caricamento = false; this.messaggio = 'Recensione inviata!';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate([
this.utente.tipo === 'autista' ? '/autista/dashboard' : '/passeggero/dashboard'
]), 1400);
},
error: (e: any) => {
this.caricamento = false;
this.errore = e.error?.errore ?? 'Errore invio recensione';
this.cdr.detectChanges();
}
});
}
back() { this.router.navigate([this.utente?.tipo === 'autista' ? '/autista/dashboard' : 
'/passeggero/dashboard']); }
}