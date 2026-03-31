  import { Component, OnInit } from '@angular/core';
  import { Router, RouterLink } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { MatCardModule } from '@angular/material/card';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatButtonModule } from '@angular/material/button';
  import { MatIconModule } from '@angular/material/icon';
  import { AuthService } from '../../../core/services/auth.service';
  import { ViaggioService } from '../../../core/services/viaggio.service';
 
  @Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink,
              MatCardModule, MatFormFieldModule, MatInputModule,
              MatButtonModule, MatIconModule],
    templateUrl: './login.html'
  })
  export class LoginComponent implements OnInit {
    id = 0;
    nome = '';
    tipo: 'autista' | 'passeggero' = 'passeggero';
    mostraLogin = false;
    viaggi: any[] = [];
 
    constructor(
      private auth: AuthService,
      private router: Router,
      private vs: ViaggioService
    ) {}
 
    ngOnInit() {
      if (this.auth.isLoggedIn()) {
        const u = this.auth.getUtente();
        this.router.navigate([
          u.tipo === 'autista' ? '/autista/dashboard' : '/passeggero/cerca'
        ]);
        return;
      }
      this.vs.getViaggi().subscribe({
        next: (res: any) => this.viaggi = (res.dati || []).slice(0, 4)
      });
    }
 
    accedi() {
      if (!this.id || !this.nome) return;
      if (this.tipo === 'autista') {
        this.auth.loginAutista(this.id, this.nome);
        this.router.navigate(['/autista/dashboard']);
      } else {
        this.auth.loginPasseggero(this.id, this.nome);
        this.router.navigate(['/passeggero/cerca']);
      }
    }
 
    vaiDettaglio(id: number) {
      this.router.navigate(['/passeggero/viaggio', id]);
    }
 
    isPiena(s: number, v: number|null) {
      return v !== null && s <= Math.round(v);
    }
  }
