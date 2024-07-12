import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

export interface DialogData {
  name: string;
  content: string;
}

@Component({
  selector: 'app-about',
  templateUrl: 'about.component.html'
})
export class AboutComponent implements AfterViewInit {
  @ViewChild('scrollArea', { static: false }) scrollArea!: ElementRef;

  display!: string
  hasScrolled: boolean = false

  constructor(
    public dialogRef: MatDialogRef<AboutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private cdRef:ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.detectScrollIndicator()
    this.cdRef.detectChanges()
  }

  onOkClick(): void {
    this.dialogRef.close();
  }

  scrollDown(): void {
    const target = this.scrollArea.nativeElement;
    const scrollTop = target.scrollTop;
    target.scrollTo({ top: scrollTop + (target.clientHeight * 0.7), behavior: 'smooth' });
  }

  detectScrollIndicator(): void {
    if(!this.hasScrolled) {
      const target = this.scrollArea.nativeElement
      if (target.scrollHeight - target.scrollTop - target.clientHeight <= 40) {
        this.hideScrollIndicator();
      } else {
        this.showScrollIndicator();
      }
    }
  }

  hideScrollIndicator(): void {
    this.hasScrolled = true;
    this.display ='none';
  }

  showScrollIndicator(): void {
    this.display ='block';
  }
}
