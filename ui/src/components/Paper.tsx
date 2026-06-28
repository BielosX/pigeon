import type { ReactNode } from "react";

interface PaperProps {
  children?: ReactNode;
}

export const Paper = ({ children }: PaperProps) => {
  return (
    <div className="shadow-md p-8 w-1/5 h-1/6 rounded-md bg-white flex flex-col justify-center items-center">
      {children}
    </div>
  );
};
