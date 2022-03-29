import { createReducer, on } from '@ngrx/store';
import { ComposerUser } from 'src/models/user';
import { addUser } from './user.action';

export interface UserState {
  userDetails: ComposerUser;
  error: string;
}

export const initialUser: UserState = {
  userDetails: {
    UserID: '',
    UserName: '',
    Email: '',
    TenentId: '',
    displayImage: '',
    Company: '',
    Type: '',
    Country: '',
    Domain: '',
  },
  error: '',
};

export const userReducer = createReducer(
  initialUser,
  on(addUser, (userState, { userDetails }) => ({
    ...userState,
    userDetails: userDetails,
  }))
);
