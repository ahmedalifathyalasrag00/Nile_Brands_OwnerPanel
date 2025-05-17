import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface BrandPayload {
  name: string;
  description: string;
  taxID: string;
  logo: File;
}

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

export interface Brand {
  _id: string;
  name: string;
  description: string;
  taxID: string;
  logo: string;
  owner: { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Injectable({ providedIn: 'root' })
export class BrandService {
  private apiUrl = 'https://nile-brands-backend.up.railway.app/api/v1';
  private staticUrl = 'https://nile-brands-backend.up.railway.app';

  constructor(private http: HttpClient) { }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('user') ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getLoggedUser(): Observable<User> {
    return this.http
      .get<{ data: User }>(`${this.apiUrl}/users/me`, { headers: this.authHeaders() })
      .pipe(
        map(res => res.data),
        catchError(err => throwError(() => err))
      );
  }

  getBrandsByOwner(ownerId: string): Observable<Brand[]> {
    return this.http
      .get<{ data: Brand[] }>(`${this.apiUrl}/brands?owner=${ownerId}`, { headers: this.authHeaders() })
      .pipe(
        map(res => res.data),
        catchError(err => throwError(() => err))
      );
  }

  createBrand(data: BrandPayload | FormData): Observable<any> {
    let body: FormData;
    if (data instanceof FormData) {
      body = data;
    } else {
      body = new FormData();
      body.append('name', data.name);
      body.append('description', data.description);
      body.append('taxID', data.taxID);
      body.append('logo', data.logo);
    }
    return this.http
      .post(`${this.apiUrl}/brands`, body, { headers: this.authHeaders() })
      .pipe(catchError(err => throwError(() => err)));
  }

  updateBrand(id: string, data: FormData): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/brands/${id}`, data, { headers: this.authHeaders() })
      .pipe(catchError(err => throwError(() => err)));
  }

  deleteBrand(id: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/brands/${id}`, { headers: this.authHeaders() })
      .pipe(catchError(err => throwError(() => err)));
  }

  getLogoUrl(raw: string): string {
    if (!raw) return '';
    if (raw.startsWith('http')) return raw;
    return `${this.staticUrl}/brands/${raw.replace(/^\/+/, '')}`;
  }
}
