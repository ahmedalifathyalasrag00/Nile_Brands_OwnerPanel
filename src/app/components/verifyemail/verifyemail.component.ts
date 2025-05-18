import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-verifyemail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.css']
})
export class VerifyemailComponent implements OnInit, OnDestroy {
  verifyForm: FormGroup;
  errorMessage = '';
  timeLeft = 600;
  timerDisplay = '10:00';
  private timerSub: Subscription | null = null;
  private email = localStorage.getItem('resetEmail') || '';

  constructor(private authService: AuthService, private router: Router) {
    this.verifyForm = new FormGroup({
      code1: new FormControl('', [Validators.required]),
      code2: new FormControl('', [Validators.required]),
      code3: new FormControl('', [Validators.required]),
      code4: new FormControl('', [Validators.required]),
      code5: new FormControl('', [Validators.required]),
      code6: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    const start = localStorage.getItem('verificationStartTime');
    const max = 600;
    if (start) {
      const elapsed = Math.floor((Date.now() - +start) / 1000);
      this.timeLeft = Math.max(max - elapsed, 0);
    } else {
      localStorage.setItem('verificationStartTime', Date.now().toString());
    }

    if (this.timeLeft > 0) {
      this.timerSub = interval(1000).subscribe(() => {
        this.timeLeft--;
        const m = Math.floor(this.timeLeft / 60);
        const s = this.timeLeft % 60;
        this.timerDisplay = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        if (this.timeLeft <= 0) {
          this.errorMessage = 'Verification code has expired';
          this.timerSub?.unsubscribe();
        }
      });
    } else {
      this.errorMessage = 'Verification code has expired';
      this.timerDisplay = '00:00';
    }
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }

  verifyEmail(): void {
    const code = Object.values(this.verifyForm.value).join('');
    if (!/^\d{6}$/.test(code)) {
      this.errorMessage = 'Please enter a valid 6-digit code';
      return;
    }

    this.errorMessage = '';
    this.authService.verifyCode(code).subscribe({
      next: () => this.router.navigate(['/reset-password']),
      error: (err) => {
        this.errorMessage = err?.error?.error?.message || 'Invalid or expired code';
      }
    });
  }

  resendCode(): void {
    if (!this.email) return;

    this.authService.forgetPassword(this.email).subscribe({
      next: (res) => {
        localStorage.setItem('resetToken', res.resetToken);
        localStorage.setItem('verificationStartTime', Date.now().toString());
        this.timeLeft = 600;
        this.timerDisplay = '10:00';
        this.errorMessage = '';
        this.timerSub?.unsubscribe();
        this.ngOnInit();
      },
      error: () => {
        this.errorMessage = 'Unable to resend code. Try again later.';
      }
    });
  }

  autoFocusNext(event: Event, nextInput: HTMLInputElement): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && nextInput) {
      nextInput.focus();
    }
  }

  autoFocusPrev(event: KeyboardEvent, prevInput: HTMLInputElement | null): void {
    if (event.key === 'Backspace') {
      const input = event.target as HTMLInputElement;
      if (!input.value && prevInput) {
        prevInput.focus();
        event.preventDefault();
      }
    }
  }
}
