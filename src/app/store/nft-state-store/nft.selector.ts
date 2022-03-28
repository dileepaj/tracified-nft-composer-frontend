import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NFTState } from './nft.reducer';
import { AppState } from '../app.state';

export const selectNFT = (state: AppState) => state.nft;
export const selectNFTContent = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent
);

export const selectBarCharts = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.NFTContent.Barcharts
);

export const selectNFTImages = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.NFTContent.Images
);

export const selectNoOfImages = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.NFTContent.Images.length
);

export const selectPieCharts = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.NFTContent.Piecharts
);

export const selectBubbleCharts = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.NFTContent.Bubblecharts
);

export const selectTable = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.NFTContent.Tables
);

export const selectCarbonFP = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.NFTContent.CarbonFootprint
);

export const selectProofBot = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.NFTContent.ProofBotData
);

export const selectTimeline = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.NFTContent.Timeline
);

export const selectNoOfTimelines = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.NFTContent.Timeline.length
);

export const selectNoOfProofbots = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.NFTContent.ProofBotData.length
);

export const selectNoOfCarbonFP = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.NFTContent.CarbonFootprint.length
);

export const selectNoOfBarCharts = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.NFTContent.Barcharts.length
);

export const selectNoOfPieCharts = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.NFTContent.Piecharts.length
);

export const selectNoOfBubbleCharts = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.NFTContent.Bubblecharts.length
);

export const selectNoOfTables = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.NFTContent.Tables.length
);

export const selectWidgetOrder = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.ContentOrderData
);
