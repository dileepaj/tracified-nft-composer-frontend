import { createReducer, on } from '@ngrx/store';
import {
  addBarChart,
  addBubbleChart,
  addCarbonFootprint,
  addNFTImage,
  addPieChart,
  addProofBot,
  addTable,
  addTimeline,
  addToOrderArray,
  deleteBarChart,
  deleteBubbleChart,
  deleteCarbonFootprint,
  deleteNFTImage,
  deletePieChart,
  deleteProofBot,
  deleteTable,
  deleteTimeline,
  removeFromOrderArray,
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

export interface NFTState {
  nftContent: NFTContent;
  error: string;
}

export const initialNft: NFTState = {
  nftContent: {
    ProjectId: Date.now().toString(),
    ProjectName: 'project1',
    NFTName: 'NFT1',
    UserId: 'abc123',
    Creator: '',
    TenentId: '784b5070-8248-11eb-bcac-339454a996be',
    Timestamp: new Date().toISOString(),
    ContentOrderData: [],
    NFTContent: {
      Barcharts: [],
      Piecharts: [],
      Bubblecharts: [],
      ProofBotData: [],
      Timeline: [],
      Stats: [],
      Tables: [],
      Images: [],
      CarbonFootprint: [],
    },
  },
  error: '',
};

export const nftReducer = createReducer(
  initialNft,
  on(addBarChart, (nft, { chart }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      NFTContent: {
        ...nft.nftContent.NFTContent,
        Barcharts: [...nft.nftContent.NFTContent.Barcharts, chart],
      },
    },
  })),

  on(addPieChart, (nft, { chart }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      NFTContent: {
        ...nft.nftContent.NFTContent,
        Piecharts: [...nft.nftContent.NFTContent.Piecharts, chart],
      },
    },
  })),

  on(addBubbleChart, (nft, { chart }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      NFTContent: {
        ...nft.nftContent.NFTContent,
        Bubblecharts: [...nft.nftContent.NFTContent.Bubblecharts, chart],
      },
    },
  })),

  on(addTimeline, (nft, { timeline }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      NFTContent: {
        ...nft.nftContent.NFTContent,
        Timeline: [...nft.nftContent.NFTContent.Timeline, timeline],
      },
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
        Images: [...nft.nftContent.NFTContent.Images, image],
      },
    },
  })),

  on(addProofBot, (nft, { proofBot }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      NFTContent: {
        ...nft.nftContent.NFTContent,
        ProofBotData: [...nft.nftContent.NFTContent.ProofBotData, proofBot],
      },
    },
  })),

  on(addTable, (nft, { table }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      NFTContent: {
        ...nft.nftContent.NFTContent,
        Tables: [...nft.nftContent.NFTContent.Tables, table],
      },
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
    nftClone.nftContent.NFTContent.Barcharts.map((data) => {
      if (data.WidgetId === chart.WidgetId) {
        i = nftClone.nftContent.NFTContent.Barcharts.indexOf(data);
      }
      return data;
    });
    nftClone.nftContent.NFTContent.Barcharts[i] = chart;
    return nftClone;
  }),

  on(updatePieChart, (nft, { chart }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.NFTContent.Piecharts.map((data) => {
      if (data.WidgetId === chart.WidgetId) {
        i = nftClone.nftContent.NFTContent.Piecharts.indexOf(data);
      }
      return data;
    });
    nftClone.nftContent.NFTContent.Piecharts[i] = chart;
    return nftClone;
  }),

  on(updateBubbleChart, (nft, { chart }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.NFTContent.Bubblecharts.map((data) => {
      if (data.WidgetId === chart.WidgetId) {
        i = nftClone.nftContent.NFTContent.Bubblecharts.indexOf(data);
      }
      return data;
    });
    nftClone.nftContent.NFTContent.Bubblecharts[i] = chart;
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
    nftClone.nftContent.NFTContent.ProofBotData.map((data) => {
      if (data.WidgetId === proofBot.WidgetId) {
        i = nftClone.nftContent.NFTContent.ProofBotData.indexOf(data);
      }
      return data;
    });
    nftClone.nftContent.NFTContent.ProofBotData[i] = proofBot;
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
    nftClone.nftContent.NFTContent.Barcharts =
      nftClone.nftContent.NFTContent.Barcharts.filter(
        (data) => data.WidgetId !== chart.WidgetId
      );
    return nftClone;
  }),

  on(deletePieChart, (nft, { chart }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.NFTContent.Piecharts =
      nftClone.nftContent.NFTContent.Piecharts.filter(
        (data) => data.WidgetId !== chart.WidgetId
      );
    return nftClone;
  }),

  on(deleteBubbleChart, (nft, { chart }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.NFTContent.Bubblecharts =
      nftClone.nftContent.NFTContent.Bubblecharts.filter(
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
    nftClone.nftContent.NFTContent.ProofBotData =
      nftClone.nftContent.NFTContent.ProofBotData.filter(
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
