 import { Component } from '@angular/core';
  import { Router, RouterLink } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { MatCardModule } from '@angular/material/card';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatButtonModule } from '@angular/material/button';
  import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
  import { MatDatepickerModule } from '@angular/material/datepicker';
  import { MatNativeDateModule } from '@angular/material/core';
  import { ViaggioService } from '../../../core/services/viaggio.service';
 
  @Component({
    selector: 'app-cerca-viaggi',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink,
              MatCardModule, MatFormFieldModule, MatInputModule,
              MatButtonModule, MatProgressSpinnerModule,
              MatDatepickerModule, MatNativeDateModule],
    templateUrl: './cerca-viaggi.html'
  })
  export class CercaViaggiComponent {
    partenza = '';
    arrivo = '';
    dataSelezionata: Date | null = null;
    viaggi: any[] = [];
    cercato = false;
    caricamento = false;
 
    constructor(private vs: ViaggioService, private router: Router) {}
 
    cerca() {
      this.caricamento = true;
      let dataStr = '';
      if (this.dataSelezionata) {
        const d = this.dataSelezionata;
        dataStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      }
      this.vs.getViaggi(this.partenza, this.arrivo, dataStr).subscribe({
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
 
    stelle(voto: number | null): number[] {
      return [1,2,3,4,5];
    }
 
    isPiena(stella: number, voto: number | null): boolean {
      return voto !== null && stella <= Math.round(voto);
    }
  }