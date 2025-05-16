import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Login } from '../../interfaces/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  invalidLoginMsg = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.invalidLoginMsg = '';

    this.authService.login(this.loginForm.value as Login).subscribe({
      next: (res) => {
        if (res.token) {
          localStorage.setItem('user', res.token);
          this.authService.getLoggedUser().subscribe({
            next: (userRes) => {
              const user = userRes.data;
              this.authService.currentUser.next(user);

              if (user.role === 'owner') {
                  this.router.navigate(['/dashboard/hero']);

              } else {
                localStorage.removeItem('user');
                this.invalidLoginMsg = 'Invalid role credentials.';
              }
              this.isLoading = false;
            },
            error: (err) => {
              this.handleError('Failed to fetch user data: ' + err.message);
            },
          });
        }
      },
      error: (err) => {
        this.handleError(err.error?.error?.message || 'Invalid credentials.');
      },
    });
  }

  private handleError(message: string) {
    this.invalidLoginMsg = message;
    this.isLoading = false;
  }
}