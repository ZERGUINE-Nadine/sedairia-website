import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {StorageService} from "../../services/storage.service";
import {NotifierService} from "../../services/notifier.service";
import {AuthService} from "../../services/auth.service";
import {map, take} from "rxjs";
import {UserRoleEnum} from "../../shared/enum/user-role.enum";
import {UserModel} from "../../shared/models/user.model";


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private readonly storageService: StorageService,
    private router: Router,
    private readonly notifier: NotifierService,
    private readonly authService: AuthService
  ) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated();

    if (!isAuthenticated) {
      this.redirectUnauthorizedUser();
      return false;
    }

    this.authService.getUserData().pipe(
      take(1),
      map((user: UserModel) => {

        if (user.role !== UserRoleEnum.ADMIN) {
          this.redirectUnauthorizedUser();
          return false;
        }

        return true;
      })
    ).subscribe();

    return true;
  }

  private redirectUnauthorizedUser(): void {
    this.router.navigate(['/connexion']);
    this.notifier.showWarning("vous n'etes pas autorisé à cette ressource");
  }
}
