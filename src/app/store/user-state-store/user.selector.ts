import { createSelector } from '@ngrx/store';
import { User } from 'src/app/entity/artifact';
import { AppState } from '../app.state';
import { UserState } from './user.reducer';

export const selectUser = (state: AppState) => state.user;
export const selectUserDetail = createSelector(
  selectUser,
  (state: UserState) => state.userDetails
);
export const selectUserName = createSelector(
  selectUser,
  (state: UserState) => state.userDetails.UserName
);
