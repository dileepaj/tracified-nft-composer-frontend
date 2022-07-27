export interface Timeline {
  WidgetId: string;
  Title?: string;
  BactchId?: string;
  ArtifactId?: string;
  ProductId?: string;
  ProductName?: string;
  TenentId?: string;
  ProjectId?: string;
  ProjectName?: string;
  UserId?: string;
  OTPType?: string;
  WidgetType?: string;
  TimelineData?: TimelineData[];
}

export interface TimelineData {
  Title: string;
  Children: Children[];
  Icon: string;
  SubTitle?: string;
  Description?: string;
  Images?: string[];
}

export interface Children {
  NewTDP: boolean;
  Timestamp : string;
  Key: string;
  Value: string;
}
