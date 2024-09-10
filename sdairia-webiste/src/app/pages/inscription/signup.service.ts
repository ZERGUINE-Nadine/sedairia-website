import { Injectable } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {Observable} from "rxjs";
import {UserRoleEnum} from "../../shared/enum/user-role.enum";

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(
    private apiService: ApiService,
  ) { }

  signup(payload: any): Observable<any> {
    return this.apiService.postRequest('signup', payload);
  }

}
