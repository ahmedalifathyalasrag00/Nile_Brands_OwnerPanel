import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { resetPassword } from '../../interfaces/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent {
  form = new FormGroup({
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  });
  errorMessage = '';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) { }

  onSubmit() {
    if (this.form.invalid || this.form.value.password !== this.form.value.confirmPassword) {
      this.errorMessage = 'Passwords must match';
      return;
    }
    this.errorMessage = '';
    this.isLoading = true;
    this.auth.resetPassword(this.form.value as resetPassword).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Reset failed';
      }
    });
  }
}
