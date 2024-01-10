import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/servies/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  form = this.fb.nonNullable.group({
    name: ['', [Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit() {
    const { email, password } = this.form.getRawValue();
    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard');
      },
      error: () => {
        console.log(this.error)
        this.error = 'Falha ao realizar login, verifique suas credenciais de acesso!'
      }
    });
  }

  createAccount() {
    const { name, email, password } = this.form.getRawValue();

    this.authService.register(name, email, password).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard');
      },
      error: () => {
        this.error = 'Erro ao criar usuário, verifique os dados digitados!';
      }
    })
  }
}
