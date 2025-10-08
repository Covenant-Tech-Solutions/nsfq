/** @format */

import { Protected } from "@/components/HOC/Protected";

export default function layout({ children }: { children: React.ReactNode }) {
  return <Protected>{children}</Protected>;
}
