export interface Chart {
  WidgetId: string;
  ChartTitle: string;
  KeyTitle: string;
  ValueTitle: string;
  ChartData: any[]; //data must be key and value  object
  Color: string[];
  FontColor: string;
  FontSize: number;
  Radius?: number[];
  XAxis?: string;
  YAxis?: string;
  Width: number;
  Height: number;
}

export interface Data {
  Key: string;
  Value: number;
}
