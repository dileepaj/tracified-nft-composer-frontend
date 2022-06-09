import { createAction, props } from '@ngrx/store';
import { CarbonFootprint } from 'src/models/nft-content/carbonFootprint';
import { CardStatus, QueryResult } from 'src/models/nft-content/cardStatus';
import { Image } from 'src/models/nft-content/image';
import { NFTContent } from 'src/models/nft-content/nft.content';
import { ProofBot } from 'src/models/nft-content/proofbot';
import { Table } from 'src/models/nft-content/table';
import { Timeline } from 'src/models/nft-content/timeline';
import { WidgetCount } from 'src/models/nft-content/widgetCount';
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

export const addTable = createAction(
  '[add nft-html] Add Table',
  props<{ table: Table }>()
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

export const updateTable = createAction(
  '[update nft-html] Update Table',
  props<{ table: Table }>()
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

export const deleteTable = createAction(
  '[delete nft-html] Delete Table',
  props<{ table: Table }>()
);

export const setWidgetOrder = createAction(
  '[set widget order] Set Widget Order',
  props<{ widgetOrder: any[] }>()
);

export const addToOrderArray = createAction(
  '[add to order array] Add to Order Array',
  props<{ widget: any }>()
);

export const removeFromOrderArray = createAction(
  '[remove from order array] Remove From Order Array',
  props<{ widget: any }>()
);

export const newProject = createAction(
  '[new project] New Project',
  props<{ nftContent: NFTContent }>()
);

export const loadProject = createAction(
  '[load project] Load Project',
  props<{ nftContent: NFTContent }>()
);

export const projectStatus = createAction(
  '[set project status] Set Project Status',
  props<{ status: boolean }>()
);

export const projectSaved = createAction(
  '[set project saved status to true] Set Project Status To True'
);

export const projectUnsaved = createAction(
  '[set project saved status to false] Set Project Status To False'
);

export const addCardtStatus = createAction(
  '[add card status] Add card Status',
  props<{ cardStatus: CardStatus }>()
);

export const addQueryResult = createAction(
  '[add card query Result] Add card Query Result',
  props<{ queryResult: QueryResult }>()
);

export const deleteQueryResult = createAction(
  '[delete card query Result] Delete card Query Result',
  props<{ queryResult: QueryResult }>()
);

export const setCardStatus = createAction(
  '[set card status] Set card status ',
  props<{ cardStatus: CardStatus[] }>()
);

export const setQueryResult = createAction(
  '[set card query Result] Set card Query Result',
  props<{ queryResult: QueryResult[] }>()
);

export const setWidgetCount = createAction(
  '[set widget count] Set widget count',
  props<{ widgetCount: WidgetCount }>()
);

/* export const deleteChartData = createAction(
  '[delete chart data] Delete Chart Data',
  props<{}>
) */
