import { Metadata } from "next";
import Signup from "@/components/Auth/Signup";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "This is Sign Up Page Alf Vision Dashboard",
};

const SignUp: React.FC = () => {
  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-cover bg-center py-8 dark:bg-gray-dark dark:shadow-card sm:p-12.5 xl:p-15"
      style={{ backgroundImage: "url('/images/background/bg.jpeg')" }}
    >
      <div className="w-full max-w-md px-4">
        <Signup />
      </div>
    </div>
  );
};

export default SignUp;
