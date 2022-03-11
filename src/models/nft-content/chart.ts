export interface Chart {
  ChartId: string;
  ChartTitle: string;
  KeyTitle: string;
  ChartData: Data[]; //data must be key and value  object
  Color: string[];
  FontColor: string;
  FontSize: number;
  XAxis?: string;
  YAxis?: string;
  XSize?: string;
  YSize?: string;
}

export interface Data {
  key: string;
  value: number;
}
