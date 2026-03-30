  import { Component } from '@angular/core';
  import { Router, RouterLink } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { MatCardModule } from '@angular/material/card';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatButtonModule } from '@angular/material/button';
  import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
  import { AuthService } from '../../../core/services/auth.service';
 
  @Component({
    selector: 'app-register-autista',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink,
              MatCardModule, MatFormFieldModule, MatInputModule,
              MatButtonModule, MatProgressSpinnerModule],
    templateUrl: './register-autista.html'
  })
  export class RegisterAutistaComponent {
    form = {
      nome: '', cognome: '', num_patente: '',
      scadenza_patente: '', telefono: '', email: ''
    };
    messaggio = ''; errore = ''; caricamento = false;
 
    constructor(private auth: AuthService, private router: Router) {}
 
    registra() {
      this.caricamento = true;
      this.auth.registraAutista(this.form).subscribe({
        next: () => {
          this.caricamento = false;
          this.messaggio = 'Registrazione completata!';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: (e: any) => {
          this.caricamento = false;
          this.errore = e.error?.errore ?? 'Errore di rete';
        }
      });
    }
  }