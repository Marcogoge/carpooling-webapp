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
    selector: 'app-register-passeggero', standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, MatFormFieldModule,
              MatInputModule, MatButtonModule, MatTooltipModule, MatIconModule],
    templateUrl: './register-passeggero.html'
  })
  export class RegisterPasseggeroComponent {
    form = { nome:'', cognome:'', documento_identita:'', telefono:'', email:'' };
    idRicevuto: number|null = null;
    errore = ''; erroriCampi: any = {}; caricamento = false;
 
    readonly REGEX = {
      nome:      /^[A-Za-zÀ-ÿ\s'-]{2,50}$/,
      documento: /^[A-Z]{2}\d{7}[A-Z]{2}$|^CA\d{5}[A-Z]{2}$|^[A-Z0-9]{6,12}$/i,
      telefono:  /^(\+39)?\s?3\d{2}[\s-]?\d{6,7}$/,
      email:     /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    };
 
    readonly HINTS = {
      nome:      'Solo lettere, min 2 caratteri',
      cognome:   'Solo lettere, min 2 caratteri',
      documento: 'Carta identita (es: AB1234567CD) o passaporto o altro documento valido',
      telefono:  'Numero cellulare italiano. Es: 3331234567',
      email:     'Indirizzo email valido. Es: mario@email.it',
    };
 
    constructor(private auth: AuthService, private router: Router) {}
 
    valida(): boolean {
      this.erroriCampi = {};
      if (!this.REGEX.nome.test(this.form.nome)) this.erroriCampi.nome = 'Nome non valido';
      if (!this.REGEX.nome.test(this.form.cognome)) this.erroriCampi.cognome = 'Cognome non valido';
      if (this.form.documento_identita.length < 5) this.erroriCampi.documento = 'Documento non valido';
      if (!this.REGEX.telefono.test(this.form.telefono)) this.erroriCampi.telefono = 'Telefono non valido';
      if (!this.REGEX.email.test(this.form.email)) this.erroriCampi.email = 'Email non valida';
      return Object.keys(this.erroriCampi).length === 0;
    }
 
    registra() {
      if (!this.valida()) { this.errore = 'Correggi i campi evidenziati'; return; }
      this.caricamento = true; this.errore = '';
      const payload = { ...this.form, email: this.form.email.toLowerCase() };
      this.auth.registraPasseggero(payload).subscribe({
        next: (r: any) => { this.caricamento = false; this.idRicevuto = r.id; },
        error: (e: any) => { this.caricamento = false; this.errore = e.error?.errore ?? 'Errore'; }
      });
    }
  }