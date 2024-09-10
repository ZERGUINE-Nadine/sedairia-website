import { Injectable } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private apiService: ApiService,
  ) { }
  login(payload:any): Observable<any> {
    return this.apiService.postRequest('login', payload);
  }

}
