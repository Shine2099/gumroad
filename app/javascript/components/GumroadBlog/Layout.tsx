import React from "react";

import { HomeFooter } from "$app/components/Home/Shared/Footer";
import { HomeNav } from "$app/components/Home/Shared/Nav";

type Props = {
  children: React.ReactNode;
};

export function BlogLayout({ children }: Props) {
  return (
    <div className="flex-1 flex flex-col bg-white text-black">
      <div className="flex-1 flex flex-col font-['ABC_Favorit'] text-base font-normal leading-relaxed tracking-tight">
        <HomeNav />
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
      <HomeFooter />
    </div>
  );
}
