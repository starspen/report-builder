import React from "react";
import { User } from "lucide-react";
import { Bell } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 h-18">
      <div className="flex items-center w-full bg-card/90 backdrop-blur-lg md:px-6 px-[15px] py-3 border-b-[0.5px] h-full justify-between">
        <div className="text-2xl">
          <img
            src="/Laksana+Business+Park+Logo.png"
            alt="logo"
            className="w-48"
          />
        </div>
        <div className="flex items-center gap-4">
          <Bell />
          <User />
        </div>
      </div>
    </header>
  );
};
