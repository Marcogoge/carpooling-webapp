 import { Component } from '@angular/core';
  import { Router, RouterLink } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { MatCardModule } from '@angular/material/card';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatButtonModule } from '@angular/material/button';
  import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
  import { ViaggioService } from '../../../core/services/viaggio.service';
  import { AuthService } from '../../../core/services/auth.service';
 
  @Component({
    selector: 'app-crea-viaggio',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink,
              MatCardModule, MatFormFieldModule, MatInputModule,
              MatButtonModule, MatProgressSpinnerModule],
    templateUrl: './crea-viaggio.html'
  })
  export class CreaViaggioComponent {
    form: any = {
      citta_partenza: '', citta_arrivo: '', data_ora_partenza: '',
      tempo_stimato: 0, contributo: 0, soste: '',
      bagaglio: true, animali: false, posti_max: 1,
      marca_auto: '', modello_auto: '', targa_auto: '', id_autista: 0
    };
    messaggio = ''; errore = ''; caricamento = false;
 
    constructor(
      private vs: ViaggioService,
      private auth: AuthService,
      private router: Router
    ) {
      const u = this.auth.getUtente();
      if (u) this.form.id_autista = u.id;
    }
 
    crea() {
      this.caricamento = true;
      this.vs.creaViaggio(this.form).subscribe({
        next: () => {
          this.caricamento = false;
          this.messaggio = 'Viaggio creato!';
          setTimeout(() => this.router.navigate(['/autista/dashboard']), 1500);
        },
        error: (e: any) => {
          this.caricamento = false;
          this.errore = e.error?.errore ?? 'Errore';
        }
      });
    }
  }