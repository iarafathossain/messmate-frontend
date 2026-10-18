import { UserRole } from "@/interfaces/user-type";
import SignupForm from "../_components/signup-form";

export default function MessSignupPage() {
  return <SignupForm role={UserRole.MESS} />;
}
