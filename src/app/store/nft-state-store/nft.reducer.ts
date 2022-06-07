import { createReducer, on } from '@ngrx/store';
import {
  addBarChart,
  addBubbleChart,
  addCarbonFootprint,
  addCardtStatus,
  addNFTImage,
  addPieChart,
  addProofBot,
  addQueryResult,
  addTable,
  addTimeline,
  addToOrderArray,
  deleteBarChart,
  deleteBubbleChart,
  deleteCarbonFootprint,
  deleteNFTImage,
  deletePieChart,
  deleteProofBot,
  deleteQueryResult,
  deleteTable,
  deleteTimeline,
  loadProject,
  newProject,
  projectSaved,
  projectStatus,
  projectUnsaved,
  removeFromOrderArray,
  setCardStatus,
  setQueryResult,
  setWidgetCount,
  setWidgetOrder,
  updateBarChart,
  updateBubbleChart,
  updateCarbonFootprint,
  updateNFTImage,
  updatePieChart,
  updateProofBot,
  updateTable,
  updateTimeline,
} from './nft.actions';
import { NFTContent } from '../../../models/nft-content/nft.content';
import { CardStatus, QueryResult } from 'src/models/nft-content/cardStatus';
import { ComposerUser } from 'src/models/user';
import { WidgetCount } from 'src/models/nft-content/widgetCount';

export interface NFTState {
  nftContent: NFTContent;
  newProj: boolean;
  cardStatus: CardStatus[];
  queryResult: QueryResult[];
  widgetCount: WidgetCount;
  error: string;
  projectSaved: boolean;
}

//let user:ComposerUser=JSON.parse(sessionStorage.getItem('User')||'');

export const initialNft: NFTState = {
  nftContent: {
    ProjectId: Date.now().toString(),
    ProjectName: '',
    NFTName: '',
    UserId: '',
    CreatorName: '',
    TenentId: '',
    Timestamp: new Date().toISOString(),
    ContentOrderData: [],
    NFTContent: {
      BarCharts: [],
      PieCharts: [],
      BubbleCharts: [],
      ProofBot: [],
      Timeline: [],
      Stats: [],
      Tables: [],
      Images: [],
      CarbonFootprint: [],
    },
  },
  newProj: true,
  cardStatus: [],
  queryResult: [],
  widgetCount: {
    BarCharts: 0,
    PieCharts: 0,
    BubbleCharts: 0,
    Tables: 0,
    Images: 0,
    Timelines: 0,
    ProofBots: 0,
  },
  error: '',
  projectSaved: false,
};

export const nftReducer = createReducer(
  initialNft,

  on(addQueryResult, (nft, { queryResult }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let index;
    let cloneQueryResult = [...nftClone.queryResult];
    cloneQueryResult.forEach((e, i) => {
      if (e.WidgetId === queryResult.WidgetId) {
        index = i;
      }
    });
    if (index === undefined) {
      nftClone.queryResult = [...nftClone.queryResult, queryResult];
    } else {
      nftClone.queryResult = [...nftClone.queryResult];
      nftClone.queryResult[index] = queryResult;
    }
    return nftClone;
  }),
  on(deleteQueryResult, (nft, { queryResult }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.queryResult = nftClone.queryResult.filter(
      (data) => data.WidgetId !== queryResult.WidgetId
    );
    return nftClone;
  }),

  on(setQueryResult, (nft, { queryResult }) => ({
    ...nft,
    queryResult: queryResult,
  })),

  on(setWidgetCount, (nft, { widgetCount }) => ({
    ...nft,
    widgetCount: widgetCount,
  })),

  on(addCardtStatus, (nft, { cardStatus }) => ({
    ...nft,
    cardStatus: [...nft.cardStatus, cardStatus],
  })),

  on(setCardStatus, (nft, { cardStatus }) => ({
    ...nft,
    cardStatus: cardStatus,
  })),

  on(newProject, (nft, { nftContent }) => ({
    ...nft,
    nftContent: nftContent,
    newProj: true,
    projectSaved: false,
  })),

  on(loadProject, (nft, { nftContent }) => ({
    ...nft,
    nftContent: nftContent,
    newProj: false,
    projectSaved: true,
  })),

  on(projectStatus, (nft, { status }) => ({
    ...nft,
    newProj: status,
  })),

  on(projectSaved, (nft) => ({
    ...nft,
    projectSaved: true,
  })),

  on(projectUnsaved, (nft) => ({
    ...nft,
    projectSaved: false,
  })),

  on(addBarChart, (nft, { chart }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      NFTContent: {
        ...nft.nftContent.NFTContent,
        BarCharts: [
          ...nft.nftContent.NFTContent.BarCharts,
          {
            ...chart,
            ChartTitle: 'Bar Chart ' + (nft.widgetCount.BarCharts + 1),
          },
        ],
      },
    },
    widgetCount: {
      ...nft.widgetCount,
      BarCharts: nft.widgetCount.BarCharts + 1,
    },
  })),

  on(addPieChart, (nft, { chart }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      NFTContent: {
        ...nft.nftContent.NFTContent,
        PieCharts: [
          ...nft.nftContent.NFTContent.PieCharts,
          {
            ...chart,
            ChartTitle: 'Pie Chart ' + (nft.widgetCount.PieCharts + 1),
          },
        ],
      },
    },
    widgetCount: {
      ...nft.widgetCount,
      PieCharts: nft.widgetCount.PieCharts + 1,
    },
  })),

  on(addBubbleChart, (nft, { chart }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      NFTContent: {
        ...nft.nftContent.NFTContent,
        BubbleCharts: [
          ...nft.nftContent.NFTContent.BubbleCharts,
          {
            ...chart,
            ChartTitle: 'Bubble Chart ' + (nft.widgetCount.BubbleCharts + 1),
          },
        ],
      },
    },
    widgetCount: {
      ...nft.widgetCount,
      BubbleCharts: nft.widgetCount.BubbleCharts + 1,
    },
  })),

  on(addTimeline, (nft, { timeline }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      NFTContent: {
        ...nft.nftContent.NFTContent,
        Timeline: [
          ...nft.nftContent.NFTContent.Timeline,
          { ...timeline, Title: 'Timeline ' + (nft.widgetCount.Timelines + 1) },
        ],
      },
    },
    widgetCount: {
      ...nft.widgetCount,
      Timelines: nft.widgetCount.Timelines + 1,
    },
  })),

  on(addCarbonFootprint, (nft, { carbonFootprint }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      NFTContent: {
        ...nft.nftContent.NFTContent,
        CarbonFootprint: [
          ...nft.nftContent.NFTContent.CarbonFootprint,
          carbonFootprint,
        ],
      },
    },
  })),

  on(addNFTImage, (nft, { image }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      NFTContent: {
        ...nft.nftContent.NFTContent,
        Images: [
          ...nft.nftContent.NFTContent.Images,
          { ...image, Title: 'Image ' + (nft.widgetCount.Images + 1) },
        ],
      },
    },
    widgetCount: {
      ...nft.widgetCount,
      Images: nft.widgetCount.Images + 1,
    },
  })),

  on(addProofBot, (nft, { proofBot }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      NFTContent: {
        ...nft.nftContent.NFTContent,
        ProofBot: [
          ...nft.nftContent.NFTContent.ProofBot,
          { ...proofBot, Title: 'ProofBot ' + (nft.widgetCount.ProofBots + 1) },
        ],
      },
    },
    widgetCount: {
      ...nft.widgetCount,
      ProofBots: nft.widgetCount.ProofBots + 1,
    },
  })),

  on(addTable, (nft, { table }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      NFTContent: {
        ...nft.nftContent.NFTContent,
        Tables: [
          ...nft.nftContent.NFTContent.Tables,
          { ...table, TableTitle: 'Table ' + (nft.widgetCount.Tables + 1) },
        ],
      },
    },
    widgetCount: {
      ...nft.widgetCount,
      Tables: nft.widgetCount.Tables + 1,
    },
  })),

  on(addToOrderArray, (nft, { widget }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      NFTContent: {
        ...nft.nftContent.NFTContent,
        WidgetOrder: [...nft.nftContent.ContentOrderData, widget],
      },
    },
  })),

  on(updateBarChart, (nft, { chart }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.NFTContent.BarCharts.map((data) => {
      if (data.WidgetId === chart.WidgetId) {
        i = nftClone.nftContent.NFTContent.BarCharts.indexOf(data);
      }
      return data;
    });
    nftClone.nftContent.NFTContent.BarCharts[i] = chart;
    return nftClone;
  }),

  on(updatePieChart, (nft, { chart }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.NFTContent.PieCharts.map((data) => {
      if (data.WidgetId === chart.WidgetId) {
        i = nftClone.nftContent.NFTContent.PieCharts.indexOf(data);
      }
      return data;
    });
    nftClone.nftContent.NFTContent.PieCharts[i] = chart;
    return nftClone;
  }),

  on(updateBubbleChart, (nft, { chart }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.NFTContent.BubbleCharts.map((data) => {
      if (data.WidgetId === chart.WidgetId) {
        i = nftClone.nftContent.NFTContent.BubbleCharts.indexOf(data);
      }
      return data;
    });
    nftClone.nftContent.NFTContent.BubbleCharts[i] = chart;
    return nftClone;
  }),

  on(updateCarbonFootprint, (nft, { carbonFootprint }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.NFTContent.CarbonFootprint.map((data) => {
      if (data.WidgetId === carbonFootprint.WidgetId) {
        i = nftClone.nftContent.NFTContent.CarbonFootprint.indexOf(data);
      }
      return data;
    });
    nftClone.nftContent.NFTContent.CarbonFootprint[i] = carbonFootprint;
    return nftClone;
  }),

  on(updateNFTImage, (nft, { image }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.NFTContent.Images.map((data) => {
      if (data.WidgetId === image.WidgetId) {
        i = nftClone.nftContent.NFTContent.Images.indexOf(data);
      }
      return data;
    });
    nftClone.nftContent.NFTContent.Images[i] = image;
    return nftClone;
  }),

  on(updateTimeline, (nft, { timeline }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.NFTContent.Timeline.map((data) => {
      if (data.WidgetId === timeline.WidgetId) {
        i = nftClone.nftContent.NFTContent.Timeline.indexOf(data);
      }
      return data;
    });
    nftClone.nftContent.NFTContent.Timeline[i] = timeline;
    return nftClone;
  }),

  on(updateProofBot, (nft, { proofBot }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.NFTContent.ProofBot.map((data) => {
      if (data.WidgetId === proofBot.WidgetId) {
        i = nftClone.nftContent.NFTContent.ProofBot.indexOf(data);
      }
      return data;
    });
    nftClone.nftContent.NFTContent.ProofBot[i] = proofBot;
    return nftClone;
  }),

  on(updateTable, (nft, { table }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.NFTContent.Tables.map((data) => {
      if (data.WidgetId === table.WidgetId) {
        i = nftClone.nftContent.NFTContent.Tables.indexOf(data);
      }
      return data;
    });
    nftClone.nftContent.NFTContent.Tables[i] = table;
    return nftClone;
  }),

  on(deleteBarChart, (nft, { chart }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.NFTContent.BarCharts =
      nftClone.nftContent.NFTContent.BarCharts.filter(
        (data) => data.WidgetId !== chart.WidgetId
      );
    return nftClone;
  }),

  on(deletePieChart, (nft, { chart }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.NFTContent.PieCharts =
      nftClone.nftContent.NFTContent.PieCharts.filter(
        (data) => data.WidgetId !== chart.WidgetId
      );
    return nftClone;
  }),

  on(deleteBubbleChart, (nft, { chart }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.NFTContent.BubbleCharts =
      nftClone.nftContent.NFTContent.BubbleCharts.filter(
        (data) => data.WidgetId !== chart.WidgetId
      );
    return nftClone;
  }),

  on(deleteCarbonFootprint, (nft, { carbonFootPrint }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.NFTContent.CarbonFootprint =
      nftClone.nftContent.NFTContent.CarbonFootprint.filter(
        (data) => data.WidgetId !== carbonFootPrint.WidgetId
      );
    return nftClone;
  }),

  on(deleteNFTImage, (nft, { image }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.NFTContent.Images =
      nftClone.nftContent.NFTContent.Images.filter(
        (data) => data.WidgetId !== image.WidgetId
      );
    return nftClone;
  }),

  on(deleteProofBot, (nft, { proofBot }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.NFTContent.ProofBot =
      nftClone.nftContent.NFTContent.ProofBot.filter(
        (data) => data.WidgetId !== proofBot.WidgetId
      );
    return nftClone;
  }),

  on(deleteTimeline, (nft, { timeline }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.NFTContent.Timeline =
      nftClone.nftContent.NFTContent.Timeline.filter(
        (data) => data.WidgetId !== timeline.WidgetId
      );
    return nftClone;
  }),

  on(deleteTable, (nft, { table }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.NFTContent.Tables =
      nftClone.nftContent.NFTContent.Tables.filter(
        (data) => data.WidgetId !== table.WidgetId
      );
    return nftClone;
  }),

  on(removeFromOrderArray, (nft, { widget }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.ContentOrderData =
      nftClone.nftContent.ContentOrderData.filter(
        (data) => data.WidgetId !== widget.WidgetId
      );
    return nftClone;
  }),

  on(setWidgetOrder, (nft, { widgetOrder }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    nftClone.nftContent.ContentOrderData = widgetOrder;
    return nftClone;
  })
);
