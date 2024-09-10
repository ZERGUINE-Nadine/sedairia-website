import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {filter, map, Observable, of, Subject, switchMap, take, takeUntil, tap} from "rxjs";
import {StorageService} from "../../services/storage.service";
import {Router} from "@angular/router";
import {NotifierService} from "../../services/notifier.service";
import {UserModel} from "../../shared/models/user.model";
import {AsyncPipe, NgClass} from "@angular/common";
import {AdminService} from "./admin.service";
import {UserRoleEnum} from "../../shared/enum/user-role.enum";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../../shared/components/confirmation-dialog/confirmation-dialog.component";
import {UserDetailsDialogComponent} from "../../shared/components/user-details-dialog/user-details-dialog.component";

export enum AdminScreens {
  STATS= "stats",
  ORDERS = "orders",
  USERS = "users",
  APPOINTMENTS = "appointments",
}


@Component({
  selector: 'app-profil.admin',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass
  ],
  templateUrl: './profile-admin.component.html',
  styleUrl: './profile-admin.component.scss'
})
export class ProfileAdminComponent implements OnDestroy, OnInit {

    private componentDestroyer$: Subject<void> = new Subject<void>();

    protected userData$!: Observable<UserModel>;

    protected selectedScreen: AdminScreens = AdminScreens.STATS;

    protected usersList$!: Observable<UserModel[]>;

    constructor(
      private readonly authService: AuthService,
      private readonly storageService: StorageService,
      private readonly router: Router,
      private readonly notifier: NotifierService,
      private readonly adminService: AdminService,
      private readonly dialog: MatDialog,
    ) {}


  ngOnInit(): void {

      const savedScreen = localStorage.getItem('savedScreen');
      if (savedScreen) {
        this.selectedScreen = savedScreen as AdminScreens;
      }

      this.userData$ = this.authService.getUserData();
      this.usersList$ = this.adminService.getUsersList$();
  }

  ngOnDestroy(): void {
      this.componentDestroyer$.next();
      this.componentDestroyer$.complete();
  }

  onScreenChange(selectedScreen: AdminScreens): void {
      this.selectedScreen = selectedScreen;
      localStorage.setItem("savedScreen", selectedScreen);
  }

  onDeleteClick(userId: number): void {
      console.log(userId);
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '450px',
        data: { title: 'Confirmation Delete', message: 'Do you really want to delete this user ? this operation is irreversible' }
      });

      dialogRef.afterClosed().pipe(
        takeUntil(this.componentDestroyer$),
        filter(result => result === true),
        switchMap(() => this.adminService.deleteUser$(userId)),
        tap(() => {
          this.usersList$ = this.adminService.getUsersList$();
          this.notifier.showSuccess("User deleted successfully.");
        })
      ).subscribe();
  }

  onAddClick(): void {
    const dialogRef: MatDialogRef<UserDetailsDialogComponent> = this.dialog.open(UserDetailsDialogComponent, {
      width: '450px',
      data: null
    });

    dialogRef.afterClosed().pipe(
      takeUntil(this.componentDestroyer$),
      filter(result => result !== null),
      switchMap((result) => this.adminService.addNewUser$(result)),
      tap(() => {
        this.usersList$ = this.adminService.getUsersList$();
        this.notifier.showSuccess("User created successfully.");
      })
    ).subscribe();
  }

  onUpdateClick(user: UserModel): void {
      const dialogRef: MatDialogRef<UserDetailsDialogComponent> = this.dialog.open(UserDetailsDialogComponent, {
        width: '450px',
        data: { user:  user}
      });

      dialogRef.afterClosed().pipe(
        takeUntil(this.componentDestroyer$),
        filter(result => result !== null),
        switchMap((result) => this.adminService.updateUser$(result, user.id)),
        tap(() => {
          this.usersList$ = this.adminService.getUsersList$();
          this.notifier.showSuccess("User updated successfully.");
        })
      ).subscribe();
  }

  logout(): void {
    this.authService.logout().pipe(
        takeUntil(this.componentDestroyer$),
        tap(() => {
           this.storageService.clearToken();
           this.router.navigate(['/connexion']);
           this.notifier.showSuccess("logged out !");
        })
      ).subscribe();
  }

  protected readonly AdminScreens = AdminScreens;
  protected readonly of = of;
  protected readonly UserRoleEnum = UserRoleEnum;
}
