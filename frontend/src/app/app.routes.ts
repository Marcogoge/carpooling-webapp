 import { Routes } from '@angular/router';
  import { LoginComponent } from './features/auth/login/login';
  import { RegisterAutistaComponent } from './features/auth/register-autista/register-autista';
  import { RegisterPasseggeroComponent } from './features/auth/register-passeggero/register-passeggero';
  import { DashboardAutistaComponent } from './features/autista/dashboard-autista/dashboard-autista';
  import { CreaViaggioComponent } from './features/autista/crea-viaggio/crea-viaggio';
  import { GestionePrenotazioniComponent } from './features/autista/gestione-prenotazioni/gestione-prenotazioni';
  import { CercaViaggiComponent } from './features/passeggero/cerca-viaggi/cerca-viaggi';
  import { DettaglioViaggioComponent } from './features/passeggero/dettaglio-viaggio/dettaglio-viaggio';
  import { DashboardPasseggeroComponent } from './features/passeggero/dashboard-passeggero/dashboard-passeggero';
  import { FeedbackFormComponent } from './features/feedback/feedback-form';
 
  export const routes: Routes = [
    { path: '',                         redirectTo: '/home', pathMatch: 'full' },
    { path: 'home',                     component: LoginComponent },
    { path: 'login',                    component: LoginComponent },
    { path: 'registra-autista',         component: RegisterAutistaComponent },
    { path: 'registra-passeggero',      component: RegisterPasseggeroComponent },
    { path: 'autista/dashboard',        component: DashboardAutistaComponent },
    { path: 'autista/crea-viaggio',     component: CreaViaggioComponent },
    { path: 'autista/prenotazioni/:id', component: GestionePrenotazioniComponent },
    { path: 'passeggero/cerca',         component: CercaViaggiComponent },
    { path: 'passeggero/viaggio/:id',   component: DettaglioViaggioComponent },
    { path: 'passeggero/dashboard',     component: DashboardPasseggeroComponent },
    // Rotta feedback: tipo = per_autista o per_passeggero
    // id_viaggio e id_destinatario passati come query params
    { path: 'feedback',                 component: FeedbackFormComponent },
    { path: '**',                       redirectTo: '/home' }
  ];