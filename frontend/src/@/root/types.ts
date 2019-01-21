export interface UserState {
  id: number;
  name: string;
  email: string;
}

export interface AuthState {
  errors: Array<any>,
  token: string,
  user: UserState,
  submitting: boolean,
}

export interface State {
  loading: boolean,
  error: boolean,
  auth: AuthState,
}
