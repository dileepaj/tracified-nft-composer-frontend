import { createAction, props } from '@ngrx/store';
import { Chart } from '../../../models/nft-content/chart';

export const addBarChart = createAction(
  '[add nft-html] Add BarChart',
  props<{ chart: Chart }>()
);

export const addPieChart = createAction(
  '[add nft-html] Add PieChart',
  props<{ chart: Chart }>()
);
