import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });
  error = '';

  userId = this.authService.getCurrentUserId();


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  onCreate() {
    const { name, email, password } = this.form.getRawValue();
    this.authService.register(name, email, password).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard');
      },
      error: () => {
        console.log(this.error)
        this.error = 'Falha ao realizar login, verifique suas credenciais de acesso!'
      }
    });
  }

  userLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
