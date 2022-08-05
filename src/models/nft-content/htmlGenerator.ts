import { NFTContent } from './nft.content';

export interface HtmlGenerator {
  NftContent: NFTContent;
  Error: string;
}

export interface RecentProject {
  Id: string;
  ProjectId: string;
  ProjectName: string;
  Description: string;
  Timestamp: string;
}
