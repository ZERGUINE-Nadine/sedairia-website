import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl: string = "http://localhost:3000/api";

  constructor(
    private http: HttpClient
  ) { }

  postRequest(url: string, payload: any): Observable<any> {
    return  this.http.post(`${this.apiUrl}/${url}`, payload);
  }

  getRequest(url: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${url}`);
  }

  deleteRequest(url: string): Observable<any> {
    return  this.http.delete(`${this.apiUrl}/${url}`);
  }

  patchRequest(url: string, payload: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${url}`, payload);

  }
}
