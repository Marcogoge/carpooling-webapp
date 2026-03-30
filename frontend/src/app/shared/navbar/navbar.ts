import { Component } from '@angular/core';
  import { Router, RouterLink } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { MatToolbarModule } from '@angular/material/toolbar';
  import { MatButtonModule } from '@angular/material/button';
  import { AuthService } from '../../core/services/auth.service';
 
  @Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, MatToolbarModule, MatButtonModule],
    templateUrl: './navbar.html'
  })
  export class NavbarComponent {
    constructor(public auth: AuthService, private router: Router) {}
 
    logout() {
      this.auth.logout();
      this.router.navigate(['/login']);
    }
  }