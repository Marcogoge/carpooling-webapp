 import { Component, OnInit } from '@angular/core';
  import { Router, RouterLink } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatButtonModule } from '@angular/material/button';
  import { AuthService } from '../../../core/services/auth.service';
  import { ViaggioService } from '../../../core/services/viaggio.service';
 
  @Component({
    selector: 'app-login', standalone: true,
    imports: [CommonModule, FormsModule, RouterLink,
              MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './login.html'
  })
  export class LoginComponent implements OnInit {
    email = '';
    nome = '';
    tipo: 'autista'|'passeggero' = 'passeggero';
    mostraLogin = false;
    errore = '';
    caricamento = false;
    viaggi: any[] = [];
 
    constructor(
      private auth: AuthService,
      private router: Router,
      private vs: ViaggioService
    ) {}
 
    ngOnInit() {
      if (this.auth.isLoggedIn()) {
        const u = this.auth.getUtente();
        this.router.navigate([u.tipo==='autista' ? '/autista/dashboard' : '/passeggero/cerca']);
        return;
      }
      this.vs.getViaggi().subscribe({
        next: (r: any) => this.viaggi = (r.dati || []).slice(0, 4)
      });
    }
 
    accedi() {
      if (!this.email || !this.nome) {
        this.errore = 'Inserisci email e nome'; return;
      }
      this.caricamento = true; this.errore = '';
      this.auth.login(this.email, this.nome, this.tipo).subscribe({
        next: (r: any) => {
          this.caricamento = false;
          this.auth.salvaUtente(r.utente, r.tipo);
          this.router.navigate([
            r.tipo === 'autista' ? '/autista/dashboard' : '/passeggero/cerca'
          ]);
        },
        error: (e: any) => {
          this.caricamento = false;
          this.errore = e.error?.errore ?? 'Errore di accesso';
        }
      });
    }
 
    vai(id: number) { this.router.navigate(['/passeggero/viaggio', id]); }
    isPiena(s: number, v: number|null) { return v !== null && s <= Math.round(v); }
  }