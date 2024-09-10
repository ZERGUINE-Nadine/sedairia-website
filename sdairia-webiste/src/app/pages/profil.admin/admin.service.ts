import { Injectable } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {Observable} from "rxjs";
import {UserModel} from "../../shared/models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private readonly apiService: ApiService
  ) { }

  getUsersList$(): Observable<UserModel[]> {
    return this.apiService.getRequest('users/all');
  }

  deleteUser$(userId: number): Observable<void> {
    return this.apiService.deleteRequest('users/delete/' + userId);
  }

  addNewUser$(payload: UserModel): Observable<void> {
    return this.apiService.postRequest('users/create', payload);
  }

  updateUser$(payload: UserModel, userId: number): Observable<void> {
    return this.apiService.patchRequest('users/update/' + userId, payload);
  }
}
