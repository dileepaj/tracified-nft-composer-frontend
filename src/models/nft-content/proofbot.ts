export interface ProofBot {
  proofBotId: string;
  Title: string;
  Proofurls: ProofUrl[];
}

export interface ProofUrl {
  Type: string;
  Url: string;
}
