import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PrenotazioneService } from '../../../core/services/prenotazione.service';
@Component({
  selector: 'app-gestione-prenotazioni', standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule
],
  templateUrl: './gestione-prenotazioni.html'
})
export class GestionePrenotazioniComponent implements OnInit {
  prenotazioni: any[] = []; idViaggio = 0;
  votoMin: number | null = null; messaggio = '';
  Math = Math;
  constructor(
    private route: ActivatedRoute,
    private ps: PrenotazioneService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.idViaggio = +this.route.snapshot.paramMap.get('id')!;
    this.carica();
  }
  carica() {
    this.ps.getPrenotazioniViaggio(this.idViaggio, this.votoMin ?? undefined)
      .subscribe({
        next: (r: any) => {
          this.prenotazioni = r.dati;
                    this.cdr.detectChanges(); // FIX
        }
      });
  }
  accetta(id: number) {
    this.ps.aggiornaStato(id, 'accettata').subscribe(() => {
      this.messaggio = 'Accettata!';
      this.carica();
      this.cdr.detectChanges(); // FIX
    });
  }
  rifiuta(id: number) {
    this.ps.aggiornaStato(id, 'rifiutata').subscribe(() => {
      this.messaggio = 'Rifiutata.';
      this.carica();
      this.cdr.detectChanges(); // FIX
    });
  }
  lasiciaFeedback(idViaggio: number, idPasseggero: number) {
    this.router.navigate(['/feedback'], {
      queryParams: { tipo: 'per_passeggero', id_viaggio: idViaggio, id_destinatario: idPasseggero }
    });
  }
}