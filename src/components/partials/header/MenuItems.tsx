"use client";
import { useTranslations } from "@/providers/TranslationProviders";
import { MenuItem } from "@/types/menu";
import { getPageUrl } from "@/utils/helper";
import { CaretRightIcon, DotsThreeIcon } from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MenuItemComponent = dynamic(() => import("./MenuItemComponent"), {
  ssr: false,
});

type MenuItemComponentProps = {
  item: MenuItem[];
};

const MenuItems = ({ item }: MenuItemComponentProps) => {
  const pathName = usePathname();
  const { tran } = useTranslations();

  return (
    <ul className="bg-primary/10 flex items-center justify-center gap-3 rounded-full px-12 py-2">
      {item.slice(0, 4).map((menu) => (
        <li key={menu.id} className="ddn-item group/menu">
          {menu?.children?.length > 0 ? (
            <>
              <button className="group ddn-btn cursor-pointer py-2 text-lg font-medium">
                <div className="relative overflow-hidden">
                  <p className="px-2 duration-300 group-hover/menu:-translate-y-7">
                    {tran(menu.title)}
                  </p>
                  <p className="group-hover/menu:text-primary absolute top-7 left-0 px-2 duration-300 group-hover/menu:top-0">
                    {tran(menu.title)}
                  </p>
                  <p className="group-hover/menu:text-primary absolute bottom-7 left-0 pl-[4px] text-nowrap duration-300 group-hover/menu:bottom-0">
                    (
                    <span className="invisible opacity-0">
                      {tran(menu.title)}
                    </span>
                    )
                  </p>
                </div>

                <CaretRightIcon
                  weight="bold"
                  className="group-hover/menu:text-primary ml-auto duration-300 group-hover/menu:rotate-90"
                />
              </button>

              <ul className="ddn-menu flex flex-col gap-2">
                {menu?.children?.map((child) => (
                  <MenuItemComponent key={child.id} item={child} />
                ))}
              </ul>
            </>
          ) : (
            <Link
              href={getPageUrl(menu)}
              className={`group ddn-btn cursor-pointer py-2 font-semibold ${pathName === getPageUrl(menu) ? "text-primary" : ""}`}
            >
              <div className="relative overflow-hidden">
                <p className="px-2 duration-300 group-hover/menu:-translate-y-7">
                  {tran(menu.title)}
                </p>
                <p className="group-hover:text-primary absolute top-7 left-0 px-2 duration-300 group-hover:top-0">
                  {tran(menu.title)}
                </p>
                <p className="group-hover:text-primary absolute bottom-7 left-0 pl-[3px] text-nowrap duration-300 group-hover:bottom-0">
                  (
                  <span className="invisible opacity-0">
                    {tran(menu.title)}
                  </span>
                  )
                </p>
              </div>
            </Link>
          )}
        </li>
      ))}

      {item && item.length > 4 && (
        <li className="ddn-item py-4">
          <button className="ddn-btn font-semibold">
            <i className="">
              <DotsThreeIcon weight="bold" className="text-xl" />
            </i>
          </button>
          <ul className="ddn-menu relative">
            {item?.slice(4).map((menu) => (
              <li key={menu.id} className="ddn-item relative">
                {menu?.children?.length > 0 ? (
                  <>
                    <button className="ddn-btn pl-3">
                      {tran(menu.title)}
                      <CaretRightIcon weight="bold" className="" />
                    </button>
                    <ul className="ddn-menu sub-menu">
                      {menu?.children?.map((child) => (
                        <MenuItemComponent key={child.id} item={child} />
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link href={getPageUrl(menu)} className="group block">
                    {tran(menu.title)}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </li>
      )}
    </ul>
  );
};

export default MenuItems;
