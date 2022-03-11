import { Chart } from './chart';
import { ProofBot } from './proofbot';
import { Stat } from './stats';
import { Table } from './table';

export interface NFTContent {
  Id: string;
  Name: string;
  UserId: string;
  Creator: string;
  Barcharts: Chart[];
  Piecharts: Chart[];
  Bubblecharts: Chart[];
  Stats: Stat[];
  Tables: Table[];
  Images: string[];
  ProofBotData: ProofBot[];
  Timeline: any[];
}
