import { createReducer, on } from '@ngrx/store';
import { addBarChart, addPieChart } from './nft.actions';
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
  },
  error: '',
};

export const nftReducer = createReducer(
  initialNft,
  on(addBarChart, (nft, { chart }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    nftClone.nftContent.Barcharts.push(chart);
    return nftClone;
  }),
  on(addPieChart, (nft, { chart }) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    nftClone.nftContent.Piecharts.push(chart);
    return nftClone;
  })
);
