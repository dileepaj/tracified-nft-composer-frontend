export interface Chart {
  WidgetId: string;
  BactchId?: string;
  ProductName?: string;
  TenentId?: string;
  ProjectId?: string;
  ProjectName?: string;
  UserId?: string;
  OTPType?: string;
  Query?: string;
  WidgetType?: string;
  ChartTitle?: string;
  KeyTitle?: string;
  ValueTitle?: string;
  ChartData?: any[];
  Color?: string[];
  FontColor?: string;
  FontSize?: number;
  Radius?: number[];
  XAxis?: string;
  YAxis?: string;
  Width?: number;
  Height?: number;
}

export interface Data {
  Key: string;
  Value: number;
}
