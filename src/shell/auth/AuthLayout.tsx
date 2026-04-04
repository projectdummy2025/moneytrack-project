import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start">
      <div className="w-full max-w-[430px] min-h-screen bg-white flex flex-col px-[22px] py-[20px]">
        {children}
      </div>
    </div>
  );
}
