import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../global/global.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Login, Signup, resetPassword } from '../../interfaces/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = new BehaviorSubject<any>(null);
  private isRestored = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private globalService: GlobalService,
    private router: Router
  ) {
    this.restoreUser();
  }

  private get apiBase(): string {
    return `${this.globalService.apiUrl}/api/v1/auth`;
  }

  restoreUser(): Promise<void> {
    return new Promise(resolve => {
      const token = localStorage.getItem('user');
      if (token) {
        this.getLoggedUser().pipe(
          catchError(() => {
            localStorage.removeItem('user');
            this.currentUser.next(null);
            this.isRestored.next(true);
            resolve();
            return of(null);
          })
        ).subscribe(res => {
          if (res?.data) this.currentUser.next(res.data);
          this.isRestored.next(true);
          resolve();
        });
      } else {
        this.isRestored.next(true);
        resolve();
      }
    });
  }

  isUserRestored(): Observable<boolean> {
    return this.isRestored.asObservable();
  }

  getLoggedUser(): Observable<any> {
    return this.http.get<any>(
      `${this.globalService.apiUrl}/api/v1/users/me`,
      { headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('user')}` }) }
    );
  }

  signup(data: Signup): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/signup`, data).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('user', res.token);
        }
      })
    );
  }

  login(formData: Login): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/login`, formData).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('user', res.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('resetToken');
    this.currentUser.next(null);
    this.router.navigate(['/signin'], { replaceUrl: true });
  }

  forgetPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/forgetPassword`, { email }).pipe(
      tap(res => {
        if (res.resetToken) {
          localStorage.setItem('resetToken', res.resetToken);
        }
      })
    );
  }

  verifyCode(code: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiBase}/verifyCode`,
      { resetCode: code },
      { headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('resetToken')}` }) }
    ).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('user', res.token);
          localStorage.removeItem('resetToken');
        }
      })
    );
  }

  resetPassword(data: resetPassword): Observable<any> {
    return this.http.put<any>(
      `${this.apiBase}/resetPassword`,
      data,
      { headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('resetToken')}` }) }
    ).pipe(
      tap(() => {
        localStorage.removeItem('resetToken');
      })
    );
  }
}
