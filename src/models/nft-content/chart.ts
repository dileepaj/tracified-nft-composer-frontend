export interface Chart {
  WidgetId: string;
  BactchId?: string;
  ArtifactId?: string;
  ProductName?: string;
  ProductId?: string;
  TenentId?: string;
  ProjectId?: string;
  ProjectName?: string;
  UserId?: string;
  OTPType?: string;
  OTP?: string;
  Query?: string;
  QuerySuccess?: boolean;
  WidgetType?: string;
  ChartTitle?: string;
  KeyTitle?: string;
  ValueTitle?: string;
  ChartData?: Data[];
  ChartImage?: string;
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
