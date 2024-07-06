import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-color-box',
  template: '<div class="color-box" style="background-color:white;">' +
    '<div class="color-box" [style.background-color]="boxColor" [style.margin]="0"></div>' +
    '</div>',
})
export class ColorBoxComponent {
  @Input() boxColor: string = '';
}
