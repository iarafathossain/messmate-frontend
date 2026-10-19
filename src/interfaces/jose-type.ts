import { JWTPayload } from "jose";
import { UserRole } from "./user-type";

export interface IJosePayloadType extends JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
