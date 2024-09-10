import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgIf } from "@angular/common";
import { RouterLink, Router } from "@angular/router";
import { NotifierService } from '../../services/notifier.service';
import { Subject, takeUntil, tap } from 'rxjs';
import {LoginService} from "./login.service";
import {UserRoleEnum} from "../../shared/enum/user-role.enum";
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent {
  private componentDestroyer$: Subject<void> = new Subject<void>();

  constructor(
    private readonly loginService: LoginService,
    private readonly notifierService: NotifierService,
    private readonly router: Router,
    private readonly storageService: StorageService,
  ) {}

  private _connexionForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  get connexionForm(): FormGroup {
    return this._connexionForm;
  }

  oncnxClick(): void {
    if (this._connexionForm.valid) {
      const payload = this._connexionForm.getRawValue();

      this.loginService.login(payload).pipe(
        takeUntil(this.componentDestroyer$),
        tap((response: any): void => {
          const user = response.result.user;
          if (user.role === UserRoleEnum.USER) {
            this.router.navigate(['/profile-user']);
          } else if (user.role === UserRoleEnum.ADMIN) {
            this.router.navigate(['/profile-admin'])
          }
          this.storageService.saveToken(user.token);
          this.notifierService.showSuccess('Connexion réussie');
        })
      ).subscribe();
    } else {
      this._connexionForm.markAllAsTouched();
    }
  }
}








