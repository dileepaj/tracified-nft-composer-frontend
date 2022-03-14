export interface ProofBot {
  WidgetId: string;
  Title: string;
  Proofurls: ProofUrl[];
}

export interface ProofUrl {
  Type: string;
  Url: string;
}
