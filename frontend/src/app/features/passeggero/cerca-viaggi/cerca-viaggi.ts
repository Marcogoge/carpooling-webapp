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
 
  @Component({
    selector: 'app-cerca-viaggi',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink,
              MatCardModule, MatFormFieldModule, MatInputModule,
              MatButtonModule, MatProgressSpinnerModule],
    templateUrl: './cerca-viaggi.html'
  })
  export class CercaViaggiComponent {
    partenza = ''; arrivo = ''; data = '';
    viaggi: any[] = [];
    cercato = false; caricamento = false;
 
    constructor(private vs: ViaggioService, private router: Router) {}
 
    cerca() {
      this.caricamento = true;
      this.vs.getViaggi(this.partenza, this.arrivo, this.data).subscribe({
        next: (res: any) => {
          this.viaggi = res.dati;
          this.cercato = true;
          this.caricamento = false;
        },
        error: () => this.caricamento = false
      });
    }
 
    vaiDettaglio(id: number) {
      this.router.navigate(['/passeggero/viaggio', id]);
    }
  }