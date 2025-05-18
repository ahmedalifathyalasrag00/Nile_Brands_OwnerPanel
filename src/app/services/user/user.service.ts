import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface User {
  _id: string;
  name: string;
  email: string;
  userImage: string;
  role: string;
  active: boolean;
  wishlist: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://nile-brands-backend.up.railway.app/api/v1';
  private staticUrl = 'https://nile-brands-backend.up.railway.app';

  constructor(private http: HttpClient) { }
  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('user') ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getMe(): Observable<User> {
    return this.http
      .get<{ data: User }>(`${this.apiUrl}/users/me`, { headers: this.authHeaders() })
      .pipe(
        map(response => response.data),
        catchError(err => throwError(() => err))
      );
  }

  updateMe(data: FormData): Observable<User> {
    return this.http
      .put<{ data: User }>(`${this.apiUrl}/users/updateMe`, data, { headers: this.authHeaders() })
      .pipe(
        map(response => response.data),
        catchError(err => throwError(() => err))
      );
  }

  changePassword(
    currentPassword: string,
    password: string,
    confirmPassword: string
  ): Observable<any> {
    return this.http
      .put(
        `${this.apiUrl}/users/changeMyPassword`,
        { currentPassword, password, confirmPassword },
        { headers: this.authHeaders() }
      )
      .pipe(catchError(err => throwError(() => err)));
  }

  getUserImageUrl(raw: string): string {
    if (!raw) {
      return '';
    }
    if (raw.startsWith('http')) {
      return raw;
    }
    const filename = raw.replace(/^\/+/, '');
    return `${this.staticUrl}/users/${filename}`;
  }
}
