// back-button.directive.ts
import { Directive, HostListener } from '@angular/core';
import { Location } from '@angular/common';

@Directive({
  selector: '[appBackButton]' // Use as attribute: <button appBackButton>Back</button>
})
export class BackButtonDirective {

  constructor(private location: Location) {}

  @HostListener('click')
  onClick() {
    this.location.back();
  }
}
