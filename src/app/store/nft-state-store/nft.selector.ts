import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NFTState } from './nft.reducer';
import { AppState } from '../app.state';

export const selectNFT = createSelector(
  createFeatureSelector('nftEntry'),
  (state: NFTState) => {
    return state.nftContent;
  }
);
