export interface userData {
  authorized: boolean;
}
export interface setUserDataProps {
  setUserData: React.Dispatch<React.SetStateAction<userData>>;
}
