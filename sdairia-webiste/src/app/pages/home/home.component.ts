import { Component, ElementRef, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { NavComponent } from "../../shared/nav/nav.component";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavComponent,
    NgIf,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('parentDiv', { static: true }) parentDiv!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    const observer = new IntersectionObserver(this.handleParentIntersect.bind(this), observerOptions);
    if (this.parentDiv) {
      observer.observe(this.parentDiv.nativeElement);
    }
  }

  handleParentIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void {
    entries.forEach(entry => {
      if (entry.isIntersecting) {

        const imageSection = this.parentDiv.nativeElement.querySelector('#imageSection');
        const textSection = this.parentDiv.nativeElement.querySelector('#textSection');

        if (imageSection) {
          imageSection.classList.add('animate-scaleUp');
        }
        if (textSection) {
          textSection.classList.add('animate-fadeInRight');
        }
        observer.unobserve(entry.target);
      }
    });
  }

}
