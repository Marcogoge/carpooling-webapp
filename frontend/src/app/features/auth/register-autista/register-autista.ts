 import { Component } from '@angular/core';
  import { Router, RouterLink } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatButtonModule } from '@angular/material/button';
  import { MatTooltipModule } from '@angular/material/tooltip';
  import { MatIconModule } from '@angular/material/icon';
  import { AuthService } from '../../../core/services/auth.service';
 
  @Component({
    selector: 'app-register-autista', standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, MatFormFieldModule,
              MatInputModule, MatButtonModule, MatTooltipModule, MatIconModule],
    templateUrl: './register-autista.html'
  })
  export class RegisterAutistaComponent {
    form = { nome:'', cognome:'', num_patente:'', scadenza_patente:'', telefono:'', email:'' };
    idRicevuto: number|null = null;
    errore = ''; erroriCampi: any = {}; caricamento = false;
 
    // Regex di validazione
    readonly REGEX = {
      nome:     /^[A-Za-zÀ-ÿ\s'-]{2,50}$/,
      patente:  /^[A-Z]{2}\d{7}[A-Z]$/,
      telefono: /^(\+39)?\s?3\d{2}[\s-]?\d{6,7}$/,
      email:    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    };
 
    readonly HINTS = {
      nome:      'Solo lettere, min 2 caratteri. Es: Mario',
      cognome:   'Solo lettere, min 2 caratteri. Es: Rossi',
      patente:   'Formato: AA0000000A (2 lettere, 7 cifre, 1 lettera). Es: AB1234567C',
      telefono:  'Numero italiano. Es: 3331234567 oppure +39 333 1234567',
      email:     'Indirizzo email valido. Es: mario.rossi@email.it',
      scadenza:  'Data di scadenza della patente',
    };
 
    constructor(private auth: AuthService, private router: Router) {}
 
    valida(): boolean {
      this.erroriCampi = {};
      if (!this.REGEX.nome.test(this.form.nome))
        this.erroriCampi.nome = 'Nome non valido';
      if (!this.REGEX.nome.test(this.form.cognome))
        this.erroriCampi.cognome = 'Cognome non valido';
      if (!this.REGEX.patente.test(this.form.num_patente.toUpperCase()))
        this.erroriCampi.patente = 'Formato patente non valido';
      if (!this.form.scadenza_patente)
        this.erroriCampi.scadenza = 'Data scadenza obbligatoria';
      if (!this.REGEX.telefono.test(this.form.telefono))
        this.erroriCampi.telefono = 'Numero di telefono non valido';
      if (!this.REGEX.email.test(this.form.email))
        this.erroriCampi.email = 'Email non valida';
      return Object.keys(this.erroriCampi).length === 0;
    }
 
    registra() {
      if (!this.valida()) { this.errore = 'Correggi i campi evidenziati'; return; }
      this.caricamento = true; this.errore = '';
      const payload = { ...this.form, num_patente: this.form.num_patente.toUpperCase(),
                        email: this.form.email.toLowerCase() };
      this.auth.registraAutista(payload).subscribe({
        next: (r: any) => { this.caricamento = false; this.idRicevuto = r.id; },
        error: (e: any) => { this.caricamento = false; this.errore = e.error?.errore ?? 'Errore'; }
      });
    }
  }