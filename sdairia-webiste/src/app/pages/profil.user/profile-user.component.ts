import { ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {NotifierService} from "../../services/notifier.service";
import {
  BehaviorSubject, EMPTY,
  filter,
  map,
  Observable,
  retry,
  shareReplay,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap
} from "rxjs";
import {StorageService} from "../../services/storage.service";
import {UserModel} from "../../shared/models/user.model";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {format} from "date-fns";
import {fr} from "date-fns/locale";
import { parse } from 'date-fns';
import {UsersService} from "./users.service";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule, ReactiveFormsModule,
  Validators, ɵFormGroupRawValue,
  ɵGetProperty,
  ɵTypedOrUntyped
} from "@angular/forms";


export enum UserScreens {
  DOCUMENTS = "DOCUMENTS",
  ORDERS  = "ORDERS",
  APPOINTMENTS = "APPOINTMENTS",
  MY_APPOINTMENTS = "MY_APPOINTMENTS",
}

@Component({
  selector: 'app-profil.user',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    NgClass,
    NgIf,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.scss'
})
export class ProfileUserComponent implements OnInit, OnDestroy {

  private readonly componentDestroyer$: Subject<void> = new Subject<void>();

  protected selectedSection: UserScreens = UserScreens.ORDERS;

  protected userData$!: Observable<UserModel>;

  protected weekDays: { day: string, enabled: boolean }[] = [];
  protected times: string[] = [];

  private currentWeekOffset: number = 0;

  protected disablePreviousButton: boolean = true;


  protected selectedAppointment!: {day: { day: string, enabled: boolean }, time: string} | null;

  protected selectedMotif: string = "0"

  protected appointmentList$!: Observable<any[]> | null;

  private readonly _userDataSubject$: BehaviorSubject<UserModel | null> = new BehaviorSubject<UserModel | null>(null);

  usersAppointments$!: Observable<any>;

  get userData(): UserModel | null {
    return this._userDataSubject$.value;
  }

  private readonly _orderFormGroup: FormGroup = new FormGroup({
    motif: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    files: new FormControl('', Validators.required),
  });

  get ordersFormGroup(): FormGroup {
    return this._orderFormGroup as FormGroup;
  }

  userRequests$!: Observable<any>;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notifier: NotifierService,
    private readonly storageService: StorageService,
    private readonly userService: UsersService,
    private readonly cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {

    const savedScreen = localStorage.getItem("savedScreen");
    if (savedScreen) {
      this.selectedSection = savedScreen as UserScreens;
    }

    this.userData$ = this.authService.getUserData();
    this.userRequests$ = this.userData$.pipe(
      takeUntil(this.componentDestroyer$),
      tap((userData: UserModel | null) => {
        if (userData) {
          this._userDataSubject$.next(userData); // Update the subject
        }
      }),
      switchMap((userData) => {
        if (userData && userData.id) {
          return this.userService.getUsersRequests$(userData.id);
        } else {
          return EMPTY;
        }
      }),
      tap((userRequests) => {
        console.log('User requests:', userRequests);
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    )

    this.appointmentList$ = this.userService.getBookedAppointments$();
    if (this.selectedSection === UserScreens.APPOINTMENTS) {
      this.generateWeekDays();
      this.generateHalfHourTimes();
      this.appointmentList$ = this.userService.getBookedAppointments$().pipe(
        shareReplay({bufferSize: 1, refCount: false})
      );
    }
    if (this.selectedSection === UserScreens.MY_APPOINTMENTS) {
      this.usersAppointments$ = this.userService.getUsersAppointments$(this.userData?.id as number);
    }
  }


  ngOnDestroy(): void {
    this.componentDestroyer$.next();
    this.componentDestroyer$.complete();
  }

  onSectionSelect(section: UserScreens): void {
    this.selectedSection = section;
    localStorage.setItem('savedScreen', this.selectedSection);

      if (this.selectedSection === UserScreens.APPOINTMENTS) {
        this.generateWeekDays();
        this.generateHalfHourTimes();
        this.appointmentList$ = this.userService.getBookedAppointments$().pipe(
          shareReplay({bufferSize: 1, refCount: false})
        );
      }

      if (this.selectedSection === UserScreens.MY_APPOINTMENTS) {
        this.usersAppointments$ = this.userService.getUsersAppointments$(this.userData?.id as number);
      }

    if (this.selectedSection === UserScreens.DOCUMENTS) {
      this.userRequests$ = this.userService.getUsersRequests$(this.userData?.id as number);
    }
  }

  onNextWeekClick(): void {
    this.currentWeekOffset++;
    this.generateWeekDays();
    this.disablePreviousButton = false;
  }

  onPreviousWeekClick(): void {
    this.currentWeekOffset--;
    this.generateWeekDays();
    if (this.currentWeekOffset === 0) {
      this.disablePreviousButton = true
    }
  }

  onAppointmentSelect(day: { day: string, enabled: boolean }, time: string): void {
    this.selectedAppointment = {
      day: day,
      time:time
    };
  }

  isSelectedAppointmentSelected(day: { day: string, enabled: boolean }, time: string): boolean | null{
    return this.selectedAppointment &&
      this.selectedAppointment.day.day === day.day &&
      this.selectedAppointment.time === time;
  }


  onBookClick(): void {
    if (!this.selectedAppointment || !this.selectedMotif || this.selectedMotif === "0") {
      this.notifier.showWarning('merci de séléctionner une date et un motif de RDV');
      return;
    } else {
      const fullDate = parse(this.selectedAppointment.day.day, 'EEEE dd MMMM', new Date(), { locale: fr });
      const [hours, minutes] = this.selectedAppointment.time.split(':').map(Number);

      fullDate.setHours(hours);
      fullDate.setMinutes(minutes);
      fullDate.setSeconds(0);
      fullDate.setMilliseconds(0);

      const payload = {
        date: this.selectedAppointment.day.day,
        time: this.selectedAppointment.time,
        fullDate: fullDate,
        motif: this.selectedMotif
      };
      this.userService.createAppointment$(payload, this.userData?.id as number).pipe(
        takeUntil(this.componentDestroyer$),
        tap(() => {
          this.notifier.showSuccess('Votre demande de rendez-vous est enregistrée');
        }),
        switchMap(() => this.userService.getBookedAppointments$()),
        tap((appointments) => {
          this.appointmentList$ = this.userService.getBookedAppointments$();
          this.selectedMotif = "0";
          this.selectedAppointment = null;
        })
      ).subscribe();
    }
  }

  isAppointmentBooked(date: string, time: string, appointmentList: any[] | null): boolean | undefined {
    return appointmentList?.some(appointment => appointment.date === date && appointment.time === time);
  }

  onDeleteOrCancelClick(status: string, appointmentId: number): void {
    console.log(appointmentId)
    if (status === 'annuler' || status === 'refuser') {
      this.userService.deleteAppointment$(appointmentId).pipe(
        takeUntil(this.componentDestroyer$),
        tap(() => {
          this.notifier.showSuccess('Rendez-vous bien supprimer');
          this.usersAppointments$ = this.userService.getUsersAppointments$(this.userData?.id as number);
        })
      ).subscribe();
    } else {
      this.userService.cancelAppointment$(appointmentId).pipe(
        takeUntil(this.componentDestroyer$),
        tap(() => {
          this.notifier.showSuccess('Votre rendez-vous à été annuler');
          this.usersAppointments$ = this.userService.getUsersAppointments$(this.userData?.id as number);
        })
      ).subscribe();
    }
  }

  onSubmitOrderClick(): void {
    if (this.ordersFormGroup.invalid) {
      this.ordersFormGroup.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    formData.append('motif', this.ordersFormGroup.get('motif')?.value);
    formData.append('description', this.ordersFormGroup.get('description')?.value);
    formData.append('userId', String(this.userData?.id as number));

    const files = this.ordersFormGroup.get('files')?.value;
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    this.userService.submitOrderRequest$(formData).pipe(
      takeUntil(this.componentDestroyer$),
      tap(() => {
        this.notifier.showSuccess('votre demande est bien enregistrer');
        this.ordersFormGroup.reset();
        this.userRequests$ = this.userService.getUsersAppointments$(this.userData?.id as number);
        this.selectedSection = UserScreens.DOCUMENTS;
      })
    ).subscribe();
  }

  logout(): void {
    this.authService.logout().pipe(
      takeUntil(this.componentDestroyer$),
      tap(() => {
        this.notifier.showSuccess("logged out!");
        this.router.navigate(['/connexion']);
        this.storageService.clearToken();
      })
    ).subscribe();
  }



  onFileSelect(event: any): void {
    const files = event.target.files;
    this.ordersFormGroup.get('files')?.setValue(files);

    if (!this.fileValidator(this.ordersFormGroup.get('files'))) {
      this.ordersFormGroup.get('files')?.setErrors({ invalidFile: true });
    }
  }


  private fileValidator(control: AbstractControl<ɵGetProperty<ɵTypedOrUntyped<any, ɵFormGroupRawValue<any>, any>, "files">> | null): {
    [p: string]: any
  } | null {
    const files = control?.value;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type !== 'application/pdf') {
          return { invalidFile: true };
        }
      }
    }
    return null;
  }

  private generateWeekDays(): void {
    this.weekDays = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + (this.currentWeekOffset * 7));
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      const dayName = format(day, 'EEEE dd MMMM', { locale: fr });
      const isDisabled = day.getDay() === 5 || day.getDay() === 6;
      this.weekDays.push({ day: dayName, enabled: isDisabled });
    }
  }


  private generateHalfHourTimes(): void {
    const startHour = 10;
    const endHour = 15;

    for (let hour = startHour; hour <= endHour; hour++) {
      this.times.push(this.formatTime(hour, 0));
      this.times.push(this.formatTime(hour, 30));
    }
  }

  private formatTime(hour: number, minutes: number): string {
    const time = new Date();
    time.setHours(hour);
    time.setMinutes(minutes);
    return format(time, 'HH:mm', { locale: fr });
  }


  protected readonly Sections = UserScreens;
  protected readonly UserScreens = UserScreens;
}
