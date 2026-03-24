import { NgModule } from '@angular/core';
  import { RouterModule, Routes } from '@angular/router';
  import { LoginComponent } from './features/auth/login/login.component';
  import { RegisterAutistaComponent } from './features/auth/register-autista/register-autista.component';
  import { RegisterPasseggeroComponent } from './features/auth/register-passeggero/register-passeggero.component';
  import { DashboardAutistaComponent } from './features/autista/dashboard-autista/dashboard-autista.component';
  import { CreaViaggioComponent } from './features/autista/crea-viaggio/crea-viaggio.component';
  import { GestionePrenotazioniComponent } from './features/autista/gestione-prenotazioni/gestione-prenotazioni.component';
  import { CercaViaggiComponent } from './features/passeggero/cerca-viaggi/cerca-viaggi.component';
  import { DettaglioViaggioComponent } from './features/passeggero/dettaglio-viaggio/dettaglio-viaggio.component';
  import { DashboardPasseggeroComponent } from './features/passeggero/dashboard-passeggero/dashboard-passeggero.component';
 
  const routes: Routes = [
    { path: '',                    redirectTo: '/login', pathMatch: 'full' },
    { path: 'login',               component: LoginComponent },
    { path: 'registra-autista',    component: RegisterAutistaComponent },
    { path: 'registra-passeggero', component: RegisterPasseggeroComponent },
    { path: 'autista/dashboard',   component: DashboardAutistaComponent },
    { path: 'autista/crea-viaggio',component: CreaViaggioComponent },
    { path: 'autista/prenotazioni/:id', component: GestionePrenotazioniComponent },
    { path: 'passeggero/cerca',    component: CercaViaggiComponent },
    { path: 'passeggero/viaggio/:id', component: DettaglioViaggioComponent },
    { path: 'passeggero/dashboard',component: DashboardPasseggeroComponent },
    { path: '**',                  redirectTo: '/login' }
  ];
 
  @NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
  export class AppRoutingModule {}
