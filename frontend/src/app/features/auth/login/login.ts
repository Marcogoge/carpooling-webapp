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
    viaggiInEvidenza: any[] = [];
 
    constructor(
      private auth: AuthService,
      private router: Router,
      private vs: ViaggioService
    ) {}
 
    ngOnInit() {
      // Se gia loggato vai alla dashboard
      if (this.auth.isLoggedIn()) {
        const u = this.auth.getUtente();
        this.router.navigate([u.tipo === 'autista'
          ? '/autista/dashboard' : '/passeggero/cerca']);
        return;
      }
      // Carica qualche viaggio da mostrare in homepage
      this.vs.getViaggi().subscribe({
        next: (res: any) => {
          const tutti = res.dati || [];
          this.viaggiInEvidenza = tutti.slice(0, 3);
        }
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
 
    stelle(voto: number | null): number[] {
      return [1,2,3,4,5];
    }
 
    isPiena(stella: number, voto: number | null): boolean {
      return voto !== null && stella <= Math.round(voto);
    }
  }