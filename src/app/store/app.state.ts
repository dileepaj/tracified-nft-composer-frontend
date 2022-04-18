import { NFTState } from "./nft-state-store/nft.reducer";
import { UserState } from "./user-state-store/user.reducer";


export interface AppState{
    nft:NFTState;
    user:UserState;
}