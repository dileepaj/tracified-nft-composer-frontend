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
