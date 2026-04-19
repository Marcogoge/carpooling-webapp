  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { environment } from '../../../environments/environment';
 
  @Injectable({ providedIn: 'root' })
  export class ViaggioService {
    private api = `${environment.apiUrl}/viaggi/index.php`;
 
    constructor(private http: HttpClient) {}
 
  getViaggi(partenza='', arrivo='', data='',
bagaglio='', animali='', prezzoMax='', postiMin='') {
let url = `${this.api}?partenza=${partenza}&arrivo=${arrivo}&data=${data}`;
if (bagaglio) url += `&bagaglio=${bagaglio}`;
if (animali) url += `&animali=${animali}`;
if (prezzoMax) url += `&prezzo_max=${prezzoMax}`;
if (postiMin) url += `&posti_min=${postiMin}`;
return this.http.get<any>(url);
}
 
    getViaggio(id: number) {
      return this.http.get<any>(`${this.api}?id=${id}`);
    }
 
    creaViaggio(dati: any) {
      return this.http.post<any>(this.api, dati);
    }
 
    eliminaViaggio(id: number) {
      return this.http.delete<any>(`${this.api}?id=${id}`);
    }
  }