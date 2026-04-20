import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiA = `${environment.apiUrl}/autisti/index.php`;
  private apiP = `${environment.apiUrl}/passeggeri/index.php`;
  private apiL = `${environment.apiUrl}/login`;

  constructor(private http: HttpClient) {}

  registraAutista(dati: any)   { return this.http.post<any>(this.apiA, dati); }
  registraPasseggero(dati: any){ return this.http.post<any>(this.apiP, dati); }

  login(email: string, password: string, tipo: 'autista'|'passeggero') {
    return this.http.post<any>(this.apiL, { email, password, tipo });
  }

  salvaUtente(utente: any, tipo: string) {
    sessionStorage.setItem('utente', JSON.stringify({ ...utente, tipo }));
  }

  getUtente() {
    const u = sessionStorage.getItem('utente');
    return u ? JSON.parse(u) : null;
  }

  isLoggedIn() { return !!this.getUtente(); }
  logout()     { sessionStorage.removeItem('utente'); }
}