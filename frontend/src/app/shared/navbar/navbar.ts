  import { Component, Output, EventEmitter } from '@angular/core';
  import { Router, RouterLink } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { MatToolbarModule } from '@angular/material/toolbar';
  import { MatButtonModule } from '@angular/material/button';
  import { MatIconModule } from '@angular/material/icon';
  import { AuthService } from '../../core/services/auth.service';
 
  @Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink,
              MatToolbarModule, MatButtonModule, MatIconModule],
    templateUrl: './navbar.html'
  })
  export class NavbarComponent {
    @Output() darkModeToggle = new EventEmitter<void>();
    darkMode = false;
 
    constructor(public auth: AuthService, private router: Router) {}
 
    toggleDark() {
      this.darkMode = !this.darkMode;
      this.darkModeToggle.emit();
    }
 
    logout() {
      this.auth.logout();
      this.router.navigate(['/home']);
    }
  }