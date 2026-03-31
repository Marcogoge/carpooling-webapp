import { Component } from '@angular/core';
  import { Router, RouterLink } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatButtonModule } from '@angular/material/button';
  import { AuthService } from '../../../core/services/auth.service';
 
  @Component({
    selector: 'app-register-autista',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink,
              MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './register-autista.html'
  })
  export class RegisterAutistaComponent {
    form = {
      nome: '', cognome: '', num_patente: '',
      scadenza_patente: '', telefono: '', email: ''
    };
    idRicevuto: number | null = null;
    errore = '';
    caricamento = false;
 
    constructor(private auth: AuthService, private router: Router) {}
 
    registra() {
      this.caricamento = true;
      this.errore = '';
      this.auth.registraAutista(this.form).subscribe({
        next: (res: any) => {
          this.caricamento = false;
          this.idRicevuto = res.id;
        },
        error: (e: any) => {
          this.caricamento = false;
          this.errore = e.error?.errore ?? 'Errore di rete';
        }
      });
    }
 
    vai() {
      this.router.navigate(['/login']);
    }
  }