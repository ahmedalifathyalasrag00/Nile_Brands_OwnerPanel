import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = 'https://nile-brands-backend.up.railway.app/api/v1/analytics';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('user');
    if (!token) {
      this.authService.logout();
      throw new Error('No authentication token found');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(['/signin']);
    }
    return throwError(() => error);
  }

  getDashboardData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError.bind(this)));
  }

  getTrendsData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/trends`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError.bind(this)));
  }

  getProductsData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/products`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError.bind(this)));
  }
}
