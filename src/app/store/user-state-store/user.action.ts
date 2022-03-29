import { createAction, props } from '@ngrx/store';
import { ComposerUser } from 'src/models/user';

export const addUser = createAction(
  '[add composer User] Add User',
  props<{ userDetails: ComposerUser }>()
);
