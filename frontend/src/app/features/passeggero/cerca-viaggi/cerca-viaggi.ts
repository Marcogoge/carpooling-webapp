import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ViaggioService } from '../../../core/services/viaggio.service';
@Component({
  selector: 'app-cerca-viaggi', standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule,
            MatButtonModule, MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './cerca-viaggi.html'
})
export class CercaViaggiComponent {
  partenza = ''; arrivo = ''; dataObj: Date|null = null;
  viaggi: any[] = []; cercato = false; caricamento = false;
  constructor(private vs: ViaggioService, private router: Router, private cdr: ChangeDetectorRef) {}
  cerca() {
    this.caricamento = true;
    let ds = '';
    if (this.dataObj) {
      const d = this.dataObj;
      ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }
    this.vs.getViaggi(this.partenza, this.arrivo, ds).subscribe({
      next: (r: any) => {
        this.viaggi = r.dati; this.cercato = true; this.caricamento = false;
        this.cdr.detectChanges(); // FIX
      },
      error: () => { this.caricamento = false; this.cdr.detectChanges(); }
    });
  }
  vai(id: number) { this.router.navigate(['/passeggero/viaggio', id]); }
  isPiena(s: number, v: number|null) { return v !== null && s <= Math.round(v); }
}