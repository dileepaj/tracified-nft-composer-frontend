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
  (state: NFTState) => state.nftContent.NFTContent.BarCharts
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
  (state: NFTState) => state.nftContent.NFTContent.PieCharts
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
  (state: NFTState) => state.nftContent.NFTContent.ProofBot
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
  (state: NFTState) => state.nftContent.NFTContent.ProofBot.length
);

export const selectNoOfCarbonFP = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.NFTContent.CarbonFootprint.length
);

export const selectNoOfBarCharts = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.NFTContent.BarCharts.length
);

export const selectNoOfPieCharts = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.NFTContent.PieCharts.length
);

export const selectNoOfTables = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.NFTContent.Tables.length
);

export const selectWidgetOrder = createSelector(
  selectNFT,
  (state: NFTState) => state.nftContent.ContentOrderData
);

export const selectProjectStatus = createSelector(
  selectNFT,
  (state: NFTState) => state.newProj
);

export const selectCardStatus = createSelector(
  selectNFT,
  (state: NFTState) => state.cardStatus
);

export const selectQueryResult = createSelector(
  selectNFT,
  (state: NFTState) => state.queryResult
);

export const selectWidgetCount = createSelector(
  selectNFT,
  (state: NFTState) => state.widgetCount
);

export const selectProjectSavedState = createSelector(
  selectNFT,
  (state: NFTState) => state.projectSaved
);
