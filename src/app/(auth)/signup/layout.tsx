import { SignupPageWrapper } from "./_components/signup-page-wrapper";

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SignupPageWrapper>{children}</SignupPageWrapper>;
}
