  import { Component } from '@angular/core';
  import { Router, RouterLink } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatButtonModule } from '@angular/material/button';
  import { AuthService } from '../../../core/services/auth.service';
 
  @Component({
    selector: 'app-register-passeggero',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink,
              MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './register-passeggero.html'
  })
  export class RegisterPasseggeroComponent {
    form = {
      nome: '', cognome: '',
      documento_identita: '', telefono: '', email: ''
    };
    idRicevuto: number | null = null;
    errore = '';
    caricamento = false;
 
    constructor(private auth: AuthService, private router: Router) {}
 
    registra() {
      this.caricamento = true;
      this.errore = '';
      this.auth.registraPasseggero(this.form).subscribe({
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