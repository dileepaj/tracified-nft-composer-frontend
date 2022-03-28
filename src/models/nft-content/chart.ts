export interface Chart {
  WidgetId: string;
  BactchId?: string;
  ProductName?: string;
  TenentId?: string;
  ProjectId?: string;
  ProjectName?: string;
  UserId?: string;
  OTPType?: string;
  OTP?: string;
  Query?: string;
  WidgetType?: string;
  ChartTitle?: string;
  KeyTitle?: string;
  ValueTitle?: string;
  ChartData?: Data[];
  Domain?: number[];
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
  Name: string;
  Value: number;
  X?: number;
  Y?: number;
}
