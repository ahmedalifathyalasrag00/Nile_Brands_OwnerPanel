import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forget-password.component.html'
})
export class ForgetPasswordComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });
  invalidMsg = '';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) { }

  onSend() {
    if (this.form.invalid) return;
    this.invalidMsg = '';
    this.isLoading = true;
    this.auth.forgetPassword(this.form.value.email!).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/verify-email']);
      },
      error: err => {
        this.isLoading = false;
        this.invalidMsg = err.error?.message || 'Failed to send';
      }
    });
  }
}
