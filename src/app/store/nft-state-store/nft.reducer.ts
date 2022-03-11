import { createReducer, on } from '@ngrx/store';
import {
  addBarChart,
  addBubbleChart,
  addCarbonFootprint,
  addNFTImage,
  addPieChart,
  addProofBot,
  addTimeline,
  deleteBarChart,
  deleteBubbleChart,
  deleteCarbonFootprint,
  deleteNFTImage,
  deletePieChart,
  deleteProofBot,
  deleteTimeline,
  updateBarChart,
  updateBubbleChart,
  updateCarbonFootprint,
  updateNFTImage,
  updatePieChart,
  updateProofBot,
  updateTimeline,
} from './nft.actions';
import { NFTContent } from '../../../models/nft-content/nft.content';

export interface NFTState {
  nftContent: NFTContent;
  error: string;
}

export const initialNft: NFTState = {
  nftContent: {
    Id: '',
    Name: '',
    UserId: '',
    Creator: '',
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
  error: '',
};

export const nftReducer = createReducer(
  initialNft,
  on(addBarChart, (nft, { chart }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      Barcharts: [...nft.nftContent.Barcharts, chart],
    },
  })),

  on(addPieChart, (nft, { chart }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      Piecharts: [...nft.nftContent.Piecharts, chart],
    },
  })),

  on(addBubbleChart, (nft, { chart }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      Bubblecharts: [...nft.nftContent.Bubblecharts, chart],
    },
  })),

  on(addTimeline, (nft, { timeline }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      Timeline: [...nft.nftContent.Timeline, timeline],
    },
  })),

  on(addCarbonFootprint, (nft, { carbonFootprint }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      CarbonFootprint: [...nft.nftContent.CarbonFootprint, carbonFootprint],
    },
  })),

  on(addNFTImage, (nft, { image }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      Images: [...nft.nftContent.Images, image],
    },
  })),

  on(addProofBot, (nft, { proofBot }) => ({
    ...nft,
    nftContent: {
      ...nft.nftContent,
      ProofBotData: [...nft.nftContent.ProofBotData, proofBot],
    },
  })),

  on(updateBarChart, (nft, { chart }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.Barcharts.map((data) => {
      if (data.ChartId === chart.ChartId) {
        i = nftClone.nftContent.Barcharts.indexOf(data);
      }
      return data;
    });
    nftClone.nftContent.Barcharts[i] = chart;
    return nftClone;
  }),

  on(updatePieChart, (nft, { chart }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.Piecharts.map((data) => {
      if (data.ChartId === chart.ChartId) {
        i = nftClone.nftContent.Piecharts.indexOf(data);
      }
      return data;
    });
    nftClone.nftContent.Piecharts[i] = chart;
    return nftClone;
  }),

  on(updateBubbleChart, (nft, { chart }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.Bubblecharts.map((data) => {
      if (data.ChartId === chart.ChartId) {
        i = nftClone.nftContent.Bubblecharts.indexOf(data);
      }
      return data;
    });
    nftClone.nftContent.Bubblecharts[i] = chart;
    return nftClone;
  }),

  on(updateCarbonFootprint, (nft, { carbonFootprint }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.CarbonFootprint.map((data) => {
      if (data.carbonFootPrintId === carbonFootprint.carbonFootPrintId) {
        i = nftClone.nftContent.CarbonFootprint.indexOf(data);
      }
      return data;
    });
    nftClone.nftContent.CarbonFootprint[i] = carbonFootprint;
    return nftClone;
  }),

  on(updateNFTImage, (nft, { image }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.Images.map((data) => {
      if (data.imageId === image.imageId) {
        i = nftClone.nftContent.Images.indexOf(data);
      }
      return data;
    });
    nftClone.nftContent.Images[i] = image;
    return nftClone;
  }),

  on(updateTimeline, (nft, { timeline }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.Timeline.map((data) => {
      if (data.timelineId === timeline.timelineId) {
        i = nftClone.nftContent.Timeline.indexOf(data);
      }
      return data;
    });
    nftClone.nftContent.Timeline[i] = timeline;
    return nftClone;
  }),

  on(updateProofBot, (nft, { proofBot }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.ProofBotData.map((data) => {
      if (data.proofBotId === proofBot.proofBotId) {
        i = nftClone.nftContent.ProofBotData.indexOf(data);
      }
      return data;
    });
    nftClone.nftContent.ProofBotData[i] = proofBot;
    return nftClone;
  }),

  on(deleteBarChart, (nft, { chart }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.Barcharts = nftClone.nftContent.Barcharts.filter(
      (data) => data.ChartId !== chart.ChartId
    );
    return nftClone;
  }),

  on(deletePieChart, (nft, { chart }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.Piecharts = nftClone.nftContent.Piecharts.filter(
      (data) => data.ChartId !== chart.ChartId
    );
    return nftClone;
  }),

  on(deleteBubbleChart, (nft, { chart }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.Bubblecharts = nftClone.nftContent.Bubblecharts.filter(
      (data) => data.ChartId !== chart.ChartId
    );
    return nftClone;
  }),

  on(deleteCarbonFootprint, (nft, { carbonFootPrint }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.CarbonFootprint =
      nftClone.nftContent.CarbonFootprint.filter(
        (data) => data.carbonFootPrintId !== carbonFootPrint.carbonFootPrintId
      );
    return nftClone;
  }),

  on(deleteNFTImage, (nft, { image }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.Images = nftClone.nftContent.Images.filter(
      (data) => data.imageId !== image.imageId
    );
    return nftClone;
  }),

  on(deleteProofBot, (nft, { proofBot }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.ProofBotData = nftClone.nftContent.ProofBotData.filter(
      (data) => data.proofBotId !== proofBot.proofBotId
    );
    return nftClone;
  }),

  on(deleteTimeline, (nft, { timeline }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    let i = 0;
    nftClone.nftContent.Timeline = nftClone.nftContent.Timeline.filter(
      (data) => data.timelineId !== timeline.timelineId
    );
    return nftClone;
  })
);
