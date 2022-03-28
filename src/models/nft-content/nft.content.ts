import { CarbonFootprint } from './carbonFootprint';
import { Chart } from './chart';
import { Image } from './image';
import { ProofBot } from './proofbot';
import { Stat } from './stats';
import { Table } from './table';
import { Timeline } from './timeline';

export interface NFTContent {
  ProjectId: string;
  ProjectName: string;
  NFTName: string;
  UserId: string;
  TenentId: string;
  Timestamp: string;
  CreatorName: string;
  ContentOrderData: any[];
  NFTContent: {
    BarCharts: Chart[];
    PieCharts: Chart[];
    BubbleCharts: Chart[];
    Stats: Stat[];
    Tables: Table[];
    Images: Image[];
    ProofBotData: ProofBot[];
    Timeline: Timeline[];
    CarbonFootprint: CarbonFootprint[];
  };
}
