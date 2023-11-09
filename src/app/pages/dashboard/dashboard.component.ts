import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/servies/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  userId = this.authService.getCurrentUserId();

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  userLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
