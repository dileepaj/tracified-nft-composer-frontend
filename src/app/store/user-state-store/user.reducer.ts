import { createReducer, on } from '@ngrx/store';
import { ComposerUser } from 'src/models/user';
import { addUser, addUsername } from './user.action';

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
  })),
  on(addUsername, (userState, { username }) => ({
    ...userState,
    userDetails: {
      ...userState.userDetails,
      UserName: username,
    },
  }))
);
