import { createReducer, on } from '@ngrx/store';
import { addBarChart } from './nft.actions';
import { NFT} from 'src/app/entity/nft';

export interface NFTState {
  nftContent: NFT;
  error:string;
}

export const initialNft: NFTState = {
    nftContent: {
    id: 0,
    name: '',
    userId: '',
    creator: '',
    barcharts: [],
    piecharts: [],
    stats: [],
    tables: [],
    images:[],
  },
  error:"",
};

export const nftReducer = createReducer(
  initialNft,
  on(addBarChart, (nft, chart) => {
    const nftClone: NFTState = JSON.parse(JSON.stringify(nft));
    nftClone.nftContent.barcharts.push(chart);
    return nftClone;
  })
);
