import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFocusElement]',
})
export class FocusElementDirective {
  @Input('appFocusElement') isFocused: boolean;

  constructor(private hostElement: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    if (this.isFocused) {
      this.hostElement.nativeElement.focus();
    }
  }
}
