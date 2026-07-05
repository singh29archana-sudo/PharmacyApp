import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecordSaleRequest, SaleRecord } from '../models/models';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private apiUrl = 'http://localhost:5036/api/sales';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SaleRecord[]> {
    return this.http.get<SaleRecord[]>(this.apiUrl);
  }

  recordSale(sale: RecordSaleRequest): Observable<SaleRecord> {
    return this.http.post<SaleRecord>(this.apiUrl, sale);
  }
}
