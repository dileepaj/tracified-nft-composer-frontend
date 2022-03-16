import { NFTContent } from './nft.content';

export interface HtmlGenerator {
  NftContent: NFTContent;
  Error: string;
}

export interface RecentProject {
  ProjectId: string;
  ProjectName: string;
  Timestamp: string;
}
