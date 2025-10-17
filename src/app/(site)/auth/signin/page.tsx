import { Metadata } from "next";
import Signin from "@/components/Auth/Signin";

export const metadata: Metadata = {
  title: "Login",
  description: "This is Login Page Alf Vision Dashboard",
};

const SignIn: React.FC = () => {
  return (
    <div
      className="w-full h-screen flex justify-center items-center sm:p-12.5 xl:p-15 dark:bg-gray-dark dark:shadow-card bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background/bg.jpeg')" }}
    >
      <Signin />
    </div>
  );
};

export default SignIn;
