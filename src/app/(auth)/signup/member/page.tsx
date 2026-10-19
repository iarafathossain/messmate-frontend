import { UserRole } from "@/interfaces/user-type";
import SignupForm from "../_components/signup-form";

export default function MemberSignupPage() {
  return <SignupForm role={UserRole.MEMBER} />;
}
