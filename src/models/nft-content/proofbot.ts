export interface ProofBot {
  WidgetId: string;
  BactchI?: string;
  ArtifactId?: string;
  ProductName?: string;
  TenentId?: string;
  ProjectId?: string;
  ProjectName?: string;
  UserId?: string;
  OTPType?: string;
  Query?: string;
  WidgetType?: string;
  Title?: string;
  Proofurls?: ProofUrl[];
}

export interface ProofUrl {
  Type: string;
  Url: string;
}
