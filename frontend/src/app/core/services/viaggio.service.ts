  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { environment } from '../../../environments/environment';
 
  @Injectable({ providedIn: 'root' })
  export class ViaggioService {
    private api = `${environment.apiUrl}/viaggi/index.php`;
 
    constructor(private http: HttpClient) {}
 
    getViaggi(partenza='', arrivo='', data='') {
      return this.http.get<any>(
        `${this.api}?partenza=${partenza}&arrivo=${arrivo}&data=${data}`
      );
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