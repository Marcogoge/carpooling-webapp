import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { ViaggioService } from '../../../core/services/viaggio.service';
@Component({
selector: 'app-cerca-viaggi', standalone: true,
imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule,
MatButtonModule, MatProgressSpinnerModule, MatDatepickerModule,
MatNativeDateModule, MatCheckboxModule, MatSelectModule],
templateUrl: './cerca-viaggi.html'
})
export class CercaViaggiComponent implements OnInit {
partenza = ''; arrivo = ''; dataObj: Date|null = null;
bagaglio: boolean|null = null;
animali: boolean|null = null;
prezzoMax = '';
postiMin = 1;
viaggi: any[] = []; cercato = false; caricamento = false;
constructor(private vs: ViaggioService, private router: Router,
private cdr: ChangeDetectorRef) {}
ngOnInit() {
// Carica tutti i viaggi all'apertura della pagina
this.caricamento = true;
this.vs.getViaggi().subscribe({
next: (r: any) => {
this.viaggi = r.dati || [];
this.caricamento = false;
this.cdr.detectChanges();
},
error: () => { this.caricamento = false; this.cdr.detectChanges(); }
});
}
cerca() {
this.caricamento = true;
let ds = '';
if (this.dataObj) {
const d = this.dataObj;
ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
const params: any = {
partenza: this.partenza,
arrivo: this.arrivo,
data: ds,
prezzo_max: this.prezzoMax,
posti_min: String(this.postiMin),
};
if (this.bagaglio !== null) params.bagaglio = this.bagaglio ? '1' : '0';
if (this.animali !== null) params.animali = this.animali ? '1' : '0';
this.vs.getViaggi(params.partenza, params.arrivo, params.data, params.bagaglio, params.animali, params.prezzo_max, params.posti_min).subscribe({
next: (r: any) => {
this.viaggi = r.dati || []; this.cercato = true;
this.caricamento = false; this.cdr.detectChanges();
},
error: () => { this.caricamento = false; this.cdr.detectChanges(); }
});
}
reset() {
this.partenza = ''; this.arrivo = ''; this.dataObj = null;
this.bagaglio = null; this.animali = null;
this.prezzoMax = ''; this.postiMin = 1;
this.cercato = false;
this.ngOnInit();
}
vai(id: number) { this.router.navigate(['/passeggero/viaggio', id]); }
isPiena(s: number, v: number|null) { return v !== null && s <= Math.round(v); }
}