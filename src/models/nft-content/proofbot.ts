export interface ProofBot {
  WidgetId: string;
  ArtifactId?: string;
  ProductName?: string;
  TenentId?: string;
  ProjectId?: string;
  ProjectName?: string;
  UserId?: string;
  OTPType?: string;
  WidgetType?: string;
  Title?: string;
  Data?: ProofData[];
}

export interface ProofData {
  BatchId: string;
  GatewayIdentifier: string;
  TxnType: string;
  TxnHash: string;
  AvailableProofs: string[];
  Urls: ProofURL[];
}

export interface ProofURL {
  Type: string;
  Url: string;
}
