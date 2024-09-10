import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {Observable} from "rxjs";
import {StorageService} from "./storage.service";
import {UserModel} from "../shared/models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly api: ApiService,
    private readonly storageService: StorageService
  ) {}

  logout(): Observable<any> {
    return this.api.getRequest('logout');
  }

  getUserData(): Observable<UserModel> {
    return this.api.getRequest('get_user_data');
  }

  isAuthenticated(): boolean {
    return this.storageService.getToken() !== null;
  }

}
