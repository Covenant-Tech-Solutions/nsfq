/** @format */

"use client";
import { usePageComponent } from "@/hooks/usePageComponent";
import Counter from "../ui/OdometerCounter";
export default function CounterSection({ slug }: { slug: string }) {
  const { getData, tran } = usePageComponent({
    slug,
    sectionSlug: "counter-section",
  });

  if (getData("list", []).length === 0) {
    return null;
  }

  return (
    <section className="stp-30 sbp-30 relative overflow-hidden bg-slate-50">
      <div className="custom-container grid grid-cols-12 gap-6">
        {getData("list", []).map((item: any, index: number) => (
          <div
            key={index}
            className={`relative col-span-12 flex items-center justify-start gap-6 overflow-hidden rounded-md bg-slate-50/50 p-12 sm:col-span-6 xl:col-span-3`}
          >
            <div className="absolute top-10 -left-16 size-[92px] bg-yellow-400 blur-[120px]"></div>
            <div className="absolute -right-16 -bottom-10 size-[92px] bg-[#008EFB] blur-[120px]"></div>
            <div className="flex w-full flex-col items-center justify-center pb-2 text-center">
              <div className="display-4 flex items-center justify-center">
                <Counter value={item?.value} />{" "}
                <span className="block pt-2">{item?.unit}</span>
              </div>
              <p className="text-light2 pt-1">{tran(item?.title)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
