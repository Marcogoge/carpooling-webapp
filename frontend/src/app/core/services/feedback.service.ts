  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { environment } from '../../../environments/environment';
 
  @Injectable({ providedIn: 'root' })
  export class FeedbackService {
    private api = `${environment.apiUrl}/feedback/index.php`;
 
    constructor(private http: HttpClient) {}
 
    getFeedbackAutista(idAutista: number) {
      return this.http.get<any>(`${this.api}?id_autista=${idAutista}`);
    }
 
    invia(dati: any) {
      return this.http.post<any>(this.api, dati);
    }
  }