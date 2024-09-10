import { Injectable } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {Observable} from "rxjs";
import {UserModel} from "../../shared/models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private readonly api: ApiService,
  ) { }

  createAppointment$(payload: any, userId: number): Observable<void> {
    return this.api.postRequest('appointment/book/' + userId , payload);
  }

  getBookedAppointments$(): Observable<any> {
    return this.api.getRequest('appointment/all');
  }

  getUsersAppointments$(userId: number): Observable<any[]> {
    return this.api.getRequest('appointment/user/' + userId);
  }

  cancelAppointment$(appointmentId: number): Observable<void> {
    return this.api.getRequest('appointment/cancel/' + appointmentId);
  }

  deleteAppointment$(appointmentId: number): Observable<void> {
    return this.api.deleteRequest('appointment/delete/' + appointmentId);
  }

  submitOrderRequest$(formData: FormData): Observable<void> {
    return this.api.postRequest('orders/submit', formData);
  }

  getUsersRequests$(userId: number): Observable<any[]> {
    return this.api.getRequest('orders/' + userId);
  }

}
