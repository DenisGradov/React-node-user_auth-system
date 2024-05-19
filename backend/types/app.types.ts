export interface RegistrationProps {
  login?: string;
  email?: string;
  password?: string;
  userAvatar?: boolean;
  cookieToken?: string;
  avatar?: string;
  admin?: number;
}

export interface searchUserIdDbProps {
  tableName: string;
  searchKey?: string;
  searchValue?: string;
  callback?: any;
}
export interface LoginUserDataProps {
  login?: string;
  password?: string;
}
export interface updateCookieProps {
  tableName: string;
  login: string;
  newCookieToken: string;
}
