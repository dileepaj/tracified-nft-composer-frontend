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
  (state: NFTState) => state.nftContent.Barcharts
);

export const selectNFTImages = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.Images
);

export const selectNoOfImages = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.Images.length
);

export const selectPieCharts = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.Piecharts
);

export const selectBubbleCharts = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.Bubblecharts
);

export const selectTable = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.Tables
);

export const selectCarbonFP = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.CarbonFootprint
);

export const selectProofBot = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.ProofBotData
);

export const selectTimeline = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.Timeline
);

export const selectNoOfTimelines = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.Timeline.length
);

export const selectNoOfProofbots = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.ProofBotData.length
);

export const selectNoOfCarbonFP = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.CarbonFootprint.length
);

export const selectNoOfBarCharts = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.Barcharts.length
);

export const selectNoOfPieCharts = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.Piecharts.length
);

export const selectNoOfBubbleCharts = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.Bubblecharts.length
);

export const selectNoOfTables = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.Tables.length
);
