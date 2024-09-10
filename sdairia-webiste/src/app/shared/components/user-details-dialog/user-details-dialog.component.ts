import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {UserModel} from "../../models/user.model";
import {data} from "autoprefixer";

@Component({
  selector: 'app-user-details-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './user-details-dialog.component.html',
  styleUrl: './user-details-dialog.component.scss'
})
export class UserDetailsDialogComponent implements OnInit {


  private readonly _userDetailsForm: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    role: new FormControl('', [Validators.required]),
  });

  get userDetailsForm(): FormGroup {
    return this._userDetailsForm as FormGroup;
  }

  protected isEditMode: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UserDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: UserModel } | null,
  ) {}

  ngOnInit() {
    if (this.data !== null) {
      this.userDetailsForm.patchValue(this.data.user);
      this.userDetailsForm.controls['password'].disable();
    }
  }


  onConfirm(): void {
      if (this.userDetailsForm.valid) {
        const payload = this.userDetailsForm.getRawValue();
        this.dialogRef.close(payload);
      } else {
        this.userDetailsForm.markAllAsTouched();
      }
  }


  onCancel(): void {
      this.dialogRef.close(null);
  }

}
