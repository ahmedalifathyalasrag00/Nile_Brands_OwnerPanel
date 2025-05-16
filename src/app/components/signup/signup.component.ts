import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Signup } from '../../interfaces/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
    role: new FormControl('owner', Validators.required)
  });

  emailError = '';
  passwordError = '';
  invalidSignupMsg = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) { }

  signup() {
    this.emailError = '';
    this.passwordError = '';
    this.invalidSignupMsg = '';

    if (this.signupForm.invalid) {
      const emailCtrl = this.signupForm.get('email')!;
      if (emailCtrl.hasError('required')) this.emailError = 'Email Required';
      else if (emailCtrl.hasError('email')) this.emailError = 'Invalid email';

      const passCtrl = this.signupForm.get('password')!;
      if (passCtrl.hasError('required')) this.passwordError = 'Password Required';
      return;
    }

    const name = this.signupForm.get('name')!.value!;
    const email = this.signupForm.get('email')!.value!;
    const password = this.signupForm.get('password')!.value!;
    const confirmPassword = this.signupForm.get('confirmPassword')!.value!;
    const role = this.signupForm.get('role')!.value!;

    if (password !== confirmPassword) {
      this.invalidSignupMsg = 'Passwords must match';
      return;
    }
    if (role !== 'owner') {
      this.invalidSignupMsg = 'Only owners may register here';
      return;
    }

    this.isLoading = true;
    const payload: Signup = { name, email, role, password, confirmPassword };
    this.authService.signup(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/create-brand']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.invalidSignupMsg = err.error?.message || 'Registration failed';
      }
    });
  }
}
