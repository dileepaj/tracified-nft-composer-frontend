export interface ProofBot {
  WidgetId: string;
  BactchI?: string;
  ProductName?: string;
  TenentId?: string;
  ProjectId?: string;
  ProjectName?: string;
  UserId?: string;
  OTPType?: string;
  Query?: string;
  WeigetType?: string;
  Title?: string;
  Proofurls?: ProofUrl[];
}

export interface ProofUrl {
  Type: string;
  Url: string;
}
