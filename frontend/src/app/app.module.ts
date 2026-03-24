import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
  import { HttpClientModule } from '@angular/common/http';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { RouterModule } from '@angular/router';
 
  // Angular Material
  import { MatToolbarModule } from '@angular/material/toolbar';
  import { MatButtonModule } from '@angular/material/button';
  import { MatCardModule } from '@angular/material/card';
  import { MatInputModule } from '@angular/material/input';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatIconModule } from '@angular/material/icon';
  import { MatSnackBarModule } from '@angular/material/snack-bar';
  import { MatChipsModule } from '@angular/material/chips';
  import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
 
  import { AppRoutingModule } from './app-routing.module';
  import { AppComponent } from './app.component';
 
  // Shared
  import { NavbarComponent } from './shared/navbar/navbar.component';
 
  // Auth
  import { LoginComponent } from './features/auth/login/login.component';
  import { RegisterAutistaComponent } from './features/auth/register-autista/register-autista.component';
  import { RegisterPasseggeroComponent } from './features/auth/register-passeggero/register-passeggero.component';
 
  // Autista
  import { DashboardAutistaComponent } from './features/autista/dashboard-autista/dashboard-autista.component';
  import { CreaViaggioComponent } from './features/autista/crea-viaggio/crea-viaggio.component';
  import { GestionePrenotazioniComponent } from './features/autista/gestione-prenotazioni/gestione-prenotazioni.component';
 
  // Passeggero
  import { CercaViaggiComponent } from './features/passeggero/cerca-viaggi/cerca-viaggi.component';
  import { DettaglioViaggioComponent } from './features/passeggero/dettaglio-viaggio/dettaglio-viaggio.component';
  import { DashboardPasseggeroComponent } from './features/passeggero/dashboard-passeggero/dashboard-passeggero.component';
 
  const MATERIAL = [
    MatToolbarModule, MatButtonModule, MatCardModule, MatInputModule,
    MatFormFieldModule, MatIconModule, MatSnackBarModule,
    MatChipsModule, MatProgressSpinnerModule
  ];
 
  @NgModule({
    declarations: [
      AppComponent, NavbarComponent,
      LoginComponent, RegisterAutistaComponent, RegisterPasseggeroComponent,
      DashboardAutistaComponent, CreaViaggioComponent, GestionePrenotazioniComponent,
      CercaViaggiComponent, DettaglioViaggioComponent, DashboardPasseggeroComponent,
    ],
    imports: [
      BrowserModule, BrowserAnimationsModule, HttpClientModule,
      FormsModule, ReactiveFormsModule, AppRoutingModule, ...MATERIAL
    ],
    bootstrap: [AppComponent]
  })
  export class AppModule {}