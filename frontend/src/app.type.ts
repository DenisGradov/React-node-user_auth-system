export interface UserData {
  authorized: boolean;
  login?: string;
}

export type SetUserData = React.Dispatch<React.SetStateAction<UserData>>;
export interface SetUserDataProps {
  setUserData: SetUserData;
}
