  import { Component } from '@angular/core';
  import { Router, RouterLink } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { MatCardModule } from '@angular/material/card';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatButtonModule } from '@angular/material/button';
  import { AuthService } from '../../../core/services/auth.service';
 
  @Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink,
              MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './login.html'
  })
  export class LoginComponent {
    id = 0;
    nome = '';
    tipo: 'autista' | 'passeggero' = 'passeggero';
 
    constructor(private auth: AuthService, private router: Router) {}
 
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
  }