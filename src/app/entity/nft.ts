export interface Chart {
    chartId:string,
    keyTitle: string;
    valueTitle: string;
    data: Data[]; //data must be key and value  object
    color: string[];
    xAxis: string;
    yAxis: string;
    fontColor: string;
    fontSize: string;
    xSize: string;
    ySize: string;
  }
  
  export interface Data {
    key: string;
    value: number;
  }
  
  export interface NFT {
    id: number;
    name: string;
    userId: string;
    creator: string;
    barcharts: Chart[];
    piecharts: Chart[];
    stats: [];
    tables: [];
    images:[];
  }  