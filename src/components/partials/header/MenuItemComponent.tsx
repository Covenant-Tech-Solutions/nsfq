/** @format */

import { useTranslations } from "@/providers/TranslationProviders";
import { MenuItem } from "@/types/menu";
import { cn } from "@/utils/cn";
import { getPageUrl } from "@/utils/helper";
import { CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItemComponentProps {
  item: MenuItem;
}

export default function MenuItemComponent({ item }: MenuItemComponentProps) {
  const hasChildren = item.children && item.children.length > 0;
  const { tran } = useTranslations();

  const pathName = usePathname();

  return (
    <li className="ddn-item">
      {hasChildren ? (
        <>
          <button className="ddn-btn sub-menu-btn">
            {tran(item.title)}
            <CaretRightIcon />
          </button>
          <ul className="sub-menu">
            <div className="flex flex-col gap-2 p-1 px-3 py-3">
              {item.children.map((child) => (
                <MenuItemComponent key={child.id} item={child} />
              ))}
            </div>
          </ul>
        </>
      ) : (
        <Link
          href={getPageUrl(item)}
          className={cn(
            "hover:border-primary block w-full border-l-2 border-transparent px-3 duration-300",
            pathName === getPageUrl(item) && "!border-primary",
          )}
        >
          {tran(item.title)}
        </Link>
      )}
    </li>
  );
}
