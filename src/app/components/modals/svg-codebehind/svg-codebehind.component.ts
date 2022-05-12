import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-svg-codebehind',
  templateUrl: './svg-codebehind.component.html',
  styleUrls: ['./svg-codebehind.component.scss'],
})
export class SvgCodebehindComponent implements OnInit {
  code: any;
  loaded: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SvgCodebehindComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.loaded = true;
    this.code = this.data.svgCode;
    this.loaded = false;
  }
}
