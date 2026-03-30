  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { environment } from '../../../environments/environment';
 
  @Injectable({ providedIn: 'root' })
  export class PrenotazioneService {
    private api = `${environment.apiUrl}/prenotazioni/index.php`;
 
    constructor(private http: HttpClient) {}
 
    getPrenotazioniViaggio(idViaggio: number, votoMin?: number) {
      let url = `${this.api}?id_viaggio=${idViaggio}`;
      if (votoMin) url += `&voto_min=${votoMin}`;
      return this.http.get<any>(url);
    }
 
    getMiePrenotazioni(idPasseggero: number) {
      return this.http.get<any>(`${this.api}?id_passeggero=${idPasseggero}`);
    }
 
    prenota(idViaggio: number, idPasseggero: number) {
      return this.http.post<any>(this.api,
        { id_viaggio: idViaggio, id_passeggero: idPasseggero });
    }
 
    aggiornaStato(idPren: number, stato: 'accettata' | 'rifiutata') {
      return this.http.put<any>(`${this.api}?id=${idPren}`, { stato });
    }
  }