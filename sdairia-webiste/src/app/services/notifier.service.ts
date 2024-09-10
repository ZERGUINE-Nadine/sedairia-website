import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {CustomSnackbarComponent} from "../shared/components/custom-snackbar/custom-snackbar.component";


@Injectable({
  providedIn: 'root',
})
export class NotifierService {
  constructor(private readonly snackBar: MatSnackBar) {}

  showSuccess(message: string): void {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: { message: message, icon: 'check_circle', progressColor: 'bg-green-800' },
      duration: 6000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  showWarning(message: string): void {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: { message: message, icon: 'warning', progressColor: 'bg-yellow-400' },
      duration: 6000,
      panelClass: ['warning-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  showError(message: string): void {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: { message: message, icon: 'error', progressColor: 'bg-red-700' },
      duration: 6000,
      panelClass: ['error-snackbar'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
