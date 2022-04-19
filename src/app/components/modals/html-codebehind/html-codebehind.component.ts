import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-html-codebehind',
  templateUrl: './html-codebehind.component.html',
  styleUrls: ['./html-codebehind.component.scss'],
})
export class HtmlCodebehindComponent implements OnInit {
  code: any;

  constructor(
    public dialogRef: MatDialogRef<HtmlCodebehindComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.code = this.data.htmlCode;
  }
}
