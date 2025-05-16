import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor() { }
 apiUrl = 'https://nile-brands-backend.up.railway.app';
}