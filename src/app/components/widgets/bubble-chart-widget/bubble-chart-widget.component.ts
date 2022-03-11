import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigureBubbleChartComponent } from '../../modals/configure-bubble-chart/configure-bubble-chart.component';

@Component({
  selector: 'app-bubble-chart-widget',
  templateUrl: './bubble-chart-widget.component.html',
  styleUrls: ['./bubble-chart-widget.component.scss'],
})
export class BubbleChartWidgetComponent implements OnInit {
  @Input() id: any;
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  openDialog() {
    const dialogRef = this.dialog.open(ConfigureBubbleChartComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
