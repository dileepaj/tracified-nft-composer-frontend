import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { UserState } from './user.reducer';

export const selectUser = (state: AppState) => state.user;
export const selectUserDetail = createSelector(
  selectUser,
  (state: UserState) => state.userDetails
);