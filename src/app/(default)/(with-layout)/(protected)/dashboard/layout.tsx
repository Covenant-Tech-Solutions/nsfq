/** @format */

import Sidebar from "@/features/UserDashboard/Sidebar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <section className="pt-20 sm:pt-24 lg:pt-28">
        <div className="custom-container grid grid-cols-12 gap-3 lg:gap-6">
          <Sidebar />
          <div className="col-span-12 lg:col-span-9">{children}</div>
        </div>
      </section>
    </main>
  );
}
