export type IUserRole = "MANAGER" | "MEMBER";

export enum UserRole {
  MANAGER = "MANAGER",
  MEMBER = "MEMBER",
}

export enum IMessType {
  BOYS = "BOYS",
  GIRLS = "GIRLS",
}

interface ISignUpUserBase {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export interface ISignUpMess extends ISignUpUserBase {
  messName: string;
  messType: IMessType;
}

export interface ISignUpMember extends ISignUpUserBase {
  messCode: string;
}

export type ISignUpUser = ISignUpMess | ISignUpMember;
