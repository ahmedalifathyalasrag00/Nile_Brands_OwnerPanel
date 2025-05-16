import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> {
    const token = localStorage.getItem('user');
    if (!token) {
      this.router.navigate(['/signin'], { replaceUrl: true });
      return of(false);
    }
    return this.authService.getLoggedUser().pipe(
      map(res => {
        if (res.data?.role === 'owner') {
          this.authService.currentUser.next(res.data);
          return true;
        }
        localStorage.removeItem('user');
        this.router.navigate(['/signin'], { replaceUrl: true });
        return false;
      }),
      catchError(() => {
        localStorage.removeItem('user');
        this.router.navigate(['/signin'], { replaceUrl: true });
        return of(false);
      })
    );
  }
}
