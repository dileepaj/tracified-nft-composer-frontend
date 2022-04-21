import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProofBot } from 'src/models/nft-content/proofbot';

@Component({
  selector: 'app-proofbot-view',
  templateUrl: './proofbot-view.component.html',
  styleUrls: ['./proofbot-view.component.scss'],
})
export class ProofbotViewComponent implements OnInit {
  proofbot: ProofBot;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.proofbot = this.data.proofbot;
  }
}
