  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { environment } from '../../../environments/environment';
 
  @Injectable({ providedIn: 'root' })
  export class AuthService {
    private apiA = `${environment.apiUrl}/autisti/index.php`;
    private apiP = `${environment.apiUrl}/passeggeri/index.php`;
    private apiL = `${environment.apiUrl}/login`;
 
    constructor(private http: HttpClient) {}
 
    registraAutista(dati: any) {
      return this.http.post<any>(this.apiA, dati);
    }
 
    registraPasseggero(dati: any) {
      return this.http.post<any>(this.apiP, dati);
    }
 
    // Login reale: verifica email+nome nel DB
    login(email: string, nome: string, tipo: 'autista'|'passeggero') {
      return this.http.post<any>(this.apiL, { email, nome, tipo });
    }
 
    salvaUtente(utente: any, tipo: string) {
      sessionStorage.setItem('utente', JSON.stringify({ ...utente, tipo }));
    }
 
    getUtente() {
      const u = sessionStorage.getItem('utente');
      return u ? JSON.parse(u) : null;
    }
 
    logout() { sessionStorage.removeItem('utente'); }
 
    isLoggedIn() { return !!this.getUtente(); }
  }