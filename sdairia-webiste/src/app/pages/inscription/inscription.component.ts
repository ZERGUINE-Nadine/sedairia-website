import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgIf } from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {SignupService} from "./signup.service";
import {Subject, takeUntil, tap} from "rxjs";
import {NotifierService} from "../../services/notifier.service";
import {UserRoleEnum} from "../../shared/enum/user-role.enum";

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent {

  constructor(
    private signupService: SignupService,
    private notifierService: NotifierService,
    private router: Router
  ) { }

  private componentDestroyer$: Subject<void> = new Subject<void>();

  passwordError: boolean = false;

  private _signupForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password_confirmation: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  get signupForm(): FormGroup {
    return this._signupForm;
  }

  onSignupClick(): void {
    if (this._signupForm.valid) {
      let payload = this.signupForm.getRawValue();
      if (payload.password !== payload.password_confirmation) {
        this.passwordError = true;
      } else {
        this.passwordError = false;
         payload =  {
           ... payload,
           role: UserRoleEnum.USER,
         }
         console.log(payload)
        this.signupService.signup(payload).pipe(
          takeUntil(this.componentDestroyer$),
          tap(() => {
            this.notifierService.showSuccess('votre compte est créer');
            this.router.navigate(['/connexion']);
          })
        ).subscribe()
      }
    } else {
      this._signupForm.markAllAsTouched();
    }
  }
}

