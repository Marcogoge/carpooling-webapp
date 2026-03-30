  import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { MatCardModule } from '@angular/material/card';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatButtonModule } from '@angular/material/button';
  import { PrenotazioneService } from '../../../core/services/prenotazione.service';
 
  @Component({
    selector: 'app-gestione-prenotazioni',
    standalone: true,
    imports: [CommonModule, FormsModule,
              MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './gestione-prenotazioni.html'
  })
  export class GestionePrenotazioniComponent implements OnInit {
    prenotazioni: any[] = [];
    idViaggio = 0;
    votoMin: number | null = null;
    messaggio = '';
 
    constructor(
      private route: ActivatedRoute,
      private ps: PrenotazioneService
    ) {}
 
    ngOnInit() {
      this.idViaggio = +this.route.snapshot.paramMap.get('id')!;
      this.carica();
    }
 
    carica() {
      this.ps.getPrenotazioniViaggio(
        this.idViaggio, this.votoMin ?? undefined
      ).subscribe((res: any) => this.prenotazioni = res.dati);
    }
 
    accetta(id: number) {
      this.ps.aggiornaStato(id, 'accettata').subscribe(() => {
        this.messaggio = 'Prenotazione accettata!';
        this.carica();
      });
    }
 
    rifiuta(id: number) {
      this.ps.aggiornaStato(id, 'rifiutata').subscribe(() => {
        this.messaggio = 'Prenotazione rifiutata.';
        this.carica();
      });
    }
  }