import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bubble-chart-widget',
  templateUrl: './bubble-chart-widget.component.html',
  styleUrls: ['./bubble-chart-widget.component.scss'],
})
export class BubbleChartWidgetComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onClick() {
    alert('Bubble Chart');
  }
}
