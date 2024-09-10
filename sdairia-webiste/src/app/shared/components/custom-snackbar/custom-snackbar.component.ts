import {Component, Inject} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NgClass} from "@angular/common";
import {MAT_SNACK_BAR_DATA} from "@angular/material/snack-bar";

@Component({
  selector: 'app-custom-snackbar',
  standalone: true,
  imports: [
    MatIcon,
    NgClass
  ],
  templateUrl: './custom-snackbar.component.html',
  styleUrl: './custom-snackbar.component.scss'
})
export class CustomSnackbarComponent {
  progress = 100;
  duration = 6000;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: { message: string; icon?: string; progressColor: string },
  ) {}

  ngOnInit(): void {
    this.startProgressBar();
  }

  startProgressBar(): void {
    const interval = 100;
    const decrementAmount = this.progress / (this.duration / interval);

    const intervalId = setInterval(() => {
      this.progress -= decrementAmount;
      if (this.progress <= 0) {
        this.progress = 0;
        clearInterval(intervalId);
      }
    }, interval);
  }
}

