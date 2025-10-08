"use client";
import { usePageComponent } from "@/hooks/usePageComponent";
import { cn } from "@/utils/cn";

import PhosphorIcon from "@/components/ui/PhosphorIcon";

const ContactUs = ({ slug }: { slug: string }) => {
  const { getData, tran } = usePageComponent({
    slug,
    sectionSlug: "contact-us",
  });

  return (
    <section className="stp-30 custom-container">
      <div className="flex flex-col items-center justify-center gap-3">
        <p className="text-light4 text-lg font-medium">
          {getData("title", "Contact Us")}
        </p>
        <h2 className="heading-2">{tran("Let’s Get In Touch")}</h2>
      </div>
      <div className="stp-15 grid grid-cols-12 gap-6 text-center">
        {getData("list", []).map((item: any, index: number) => {
          return (
            <div
              key={index}
              className="bg-dark4 border-dark5 col-span-12 flex flex-col items-center justify-center rounded-md border p-6 md:col-span-4 lg:p-10"
            >
              <div className="bg-primary flex size-16 items-center justify-center rounded-full lg:size-20">
                <PhosphorIcon
                  iconName={item.icon}
                  size={32}
                  className={cn(`text-3xl text-white lg:text-[40px]`)}
                />
              </div>
              <h4 className="heading-4 pt-4">{tran(item?.title)}</h4>
              {item?.description ? (
                <a
                  target="_blank"
                  href={item?.value}
                  className="text-light4 pt-1 text-lg"
                >
                  {tran(item?.description)}
                </a>
              ) : (
                <p className="text-light4 pt-1 text-lg">{tran(item?.value)}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ContactUs;
