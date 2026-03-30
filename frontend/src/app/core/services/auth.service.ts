  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { environment } from '../../../environments/environment';
 
  @Injectable({ providedIn: 'root' })
  export class AuthService {
    private apiA = `${environment.apiUrl}/autisti/index.php`;
    private apiP = `${environment.apiUrl}/passeggeri/index.php`;
 
    constructor(private http: HttpClient) {}
 
    registraAutista(dati: any) {
      return this.http.post<any>(this.apiA, dati);
    }
 
    registraPasseggero(dati: any) {
      return this.http.post<any>(this.apiP, dati);
    }
 
    loginAutista(id: number, nome: string) {
      sessionStorage.setItem('utente',
        JSON.stringify({ id, nome, tipo: 'autista' }));
    }
 
    loginPasseggero(id: number, nome: string) {
      sessionStorage.setItem('utente',
        JSON.stringify({ id, nome, tipo: 'passeggero' }));
    }
 
    getUtente() {
      const u = sessionStorage.getItem('utente');
      return u ? JSON.parse(u) : null;
    }
 
    logout() { sessionStorage.removeItem('utente'); }
    isLoggedIn() { return !!this.getUtente(); }
  }
