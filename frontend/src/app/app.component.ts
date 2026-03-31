  import { Component, ChangeDetectorRef } from '@angular/core';
  import { RouterOutlet } from '@angular/router';
  import { NavbarComponent } from './shared/navbar/navbar';
 
  @Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent],
    templateUrl: './app.component.html',
    styles: []
  })
  export class AppComponent {
    darkMode = false;
 
    constructor(private cdr: ChangeDetectorRef) {}
 
    toggleDark() {
      this.darkMode = !this.darkMode;
      document.body.classList.toggle('dark-mode', this.darkMode);
      // FIX: forza Angular a rilevare i cambiamenti
      this.cdr.detectChanges();
    }
  }
