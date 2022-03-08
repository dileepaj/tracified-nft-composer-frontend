import { createAction, props } from '@ngrx/store';
import { Chart } from 'src/app/entity/nft';

export const addBarChart=createAction('[add nft-html] Add BarChart',props<Chart>());