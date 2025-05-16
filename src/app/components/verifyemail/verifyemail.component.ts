import { Component, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.css']
})
export class VerifyEmailComponent implements OnDestroy {
  controls = ['code1', 'code2', 'code3', 'code4', 'code5', 'code6'];
  form = new FormGroup(
    this.controls.reduce((acc, c) => {
      acc[c] = new FormControl('', Validators.required);
      return acc;
    }, {} as { [key: string]: FormControl })
  );
  @ViewChildren('codeInput') inputs!: QueryList<ElementRef>;
  errorMessage = '';
  timeLeft = 60;
  timerDisplay = '01:00';
  private sub: Subscription;

  constructor(private auth: AuthService, private router: Router) {
    this.sub = interval(1000).subscribe(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        const m = Math.floor(this.timeLeft / 60);
        const s = this.timeLeft % 60;
        this.timerDisplay = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  autoFocus(index: number) {
    const value = this.form.get(this.controls[index])!.value;
    if (value?.length === 1 && index < this.inputs.length - 1) {
      this.inputs.toArray()[index + 1].nativeElement.focus();
    }
  }

  onVerify() {
    if (this.form.invalid) {
      this.errorMessage = 'Please enter the full code';
      return;
    }
    const code = this.controls.map(c => this.form.get(c)!.value).join('');
    this.errorMessage = '';
    this.auth.verifyCode(code).subscribe({
      next: () => {
        this.router.navigate(['/reset-password']);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Verification failed';
      }
    });
  }
}
