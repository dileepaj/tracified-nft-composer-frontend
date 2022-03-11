import { createAction, props } from '@ngrx/store';
import { CarbonFootprint } from 'src/models/nft-content/carbonFootprint';
import { Image } from 'src/models/nft-content/image';
import { ProofBot } from 'src/models/nft-content/proofbot';
import { Timeline } from 'src/models/nft-content/timeline';
import { Chart } from '../../../models/nft-content/chart';

export const addBarChart = createAction(
  '[add nft-html] Add BarChart',
  props<{ chart: Chart }>()
);

export const addPieChart = createAction(
  '[add nft-html] Add PieChart',
  props<{ chart: Chart }>()
);

export const addBubbleChart = createAction(
  '[add nft-html] Add BubbleChart',
  props<{ chart: Chart }>()
);

export const addNFTImage = createAction(
  '[add nft-html] Add NFT Image',
  props<{ image: Image }>()
);

export const addTimeline = createAction(
  '[add nft-html] Add Timeline',
  props<{ timeline: Timeline }>()
);

export const addCarbonFootprint = createAction(
  '[add nft-html] Add Carbon Footprint',
  props<{ carbonFootprint: CarbonFootprint }>()
);

export const addProofBot = createAction(
  '[add nft-html] Add Proof Bot',
  props<{ proofBot: ProofBot }>()
);

export const updateNFTImage = createAction(
  '[update nft-html] Update NFT Image',
  props<{ image: Image }>()
);

export const updateBarChart = createAction(
  '[update nft-html] Update Bar Chart',
  props<{ chart: Chart }>()
);

export const updatePieChart = createAction(
  '[update nft-html] Update Pie Chart',
  props<{ chart: Chart }>()
);

export const updateBubbleChart = createAction(
  '[update nft-html] Update Bubble Chart',
  props<{ chart: Chart }>()
);

export const updateTimeline = createAction(
  '[update nft-html] Update Timeline',
  props<{ timeline: Timeline }>()
);

export const updateProofBot = createAction(
  '[update nft-html] Update Proof Bot',
  props<{ proofBot: ProofBot }>()
);

export const updateCarbonFootprint = createAction(
  '[update nft-html] Update Carbon Footprint',
  props<{ carbonFootprint: CarbonFootprint }>()
);

export const deleteBarChart = createAction(
  '[delete nft-html] Delete Bar Chart',
  props<{ chart: Chart }>()
);

export const deletePieChart = createAction(
  '[delete nft-html] Delete Pie Chart',
  props<{ chart: Chart }>()
);

export const deleteBubbleChart = createAction(
  '[delete nft-html] Delete Bubble Chart',
  props<{ chart: Chart }>()
);

export const deleteNFTImage = createAction(
  '[delete nft-html] Delete NFT Image',
  props<{ image: Image }>()
);

export const deleteTimeline = createAction(
  '[delete nft-html] Delete Timeline',
  props<{ timeline: Timeline }>()
);

export const deleteCarbonFootprint = createAction(
  '[delete nft-html] Delete Carbon Footprint',
  props<{ carbonFootPrint: CarbonFootprint }>()
);

export const deleteProofBot = createAction(
  '[delete nft-html] Delete Proof Bot',
  props<{ proofBot: ProofBot }>()
);
