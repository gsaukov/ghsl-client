import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-color-box',
  template: '<div class="color-box" [style.height]="boxHeight"  style="background-color:white;">' +
    '<div class="color-box" [style.background-color]="boxColor" [style.height]="boxHeight" [style.margin]="0"></div>' +
    '</div>',
})
export class ColorBoxComponent {
  @Input() boxColor: string = '';
  @Input() boxHeight: string = '1em';
}
