import { CarbonFootprint } from './carbonFootprint';
import { Chart } from './chart';
import { Image } from './image';
import { ProofBot } from './proofbot';
import { Stat } from './stats';
import { Table } from './table';
import { Timeline } from './timeline';

export interface NFTContent {
  Id: string;
  Name: string;
  UserId: string;
  Creator: string;
  WidgetOrder: any[];
  Barcharts: Chart[];
  Piecharts: Chart[];
  Bubblecharts: Chart[];
  Stats: Stat[];
  Tables: Table[];
  Images: Image[];
  ProofBotData: ProofBot[];
  Timeline: Timeline[];
  CarbonFootprint: CarbonFootprint[];
}
