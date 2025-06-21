import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface OwnerOrdersResponse {
  length: number;
  data: any[];
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private baseUrl = 'https://nile-brands.up.railway.app/api/v1/orders/myOrders';
  constructor(private http: HttpClient) { }

  getOwnerOrders(page: number): Observable<OwnerOrdersResponse> {
    const url = `${this.baseUrl}?page=${page}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('user')}`
    });

    return this.http.get<OwnerOrdersResponse>(url, { headers }).pipe(
      catchError(err => {
        if (
          err.status === 500 &&
          err.error != null &&
          typeof err.error.length === 'number' &&
          Array.isArray(err.error.data)
        ) {
          return of(err.error as OwnerOrdersResponse);
        }
        return throwError(() => err);
      }),
      map(res => ({
        length: res.length,
        data: res.data.map(order => {
          const { user, ...rest } = order;
          return rest;
        })
      }))
    );
  }
}
