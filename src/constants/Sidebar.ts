/** @format */

import {
  BookmarkIcon,
  ClockCounterClockwiseIcon,
  CoinIcon,
  CoinsIcon,
  CrownIcon,
  GearFineIcon,
  ListHeartIcon,
  MoneyWavyIcon,
  ShieldChevronIcon,
  SignOutIcon,
  TicketIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";
import { v4 as uuidv4 } from "uuid";

export interface SidebarMenuType {
  id: string;
  name: string;
  link: string;
  icon: any;
}
export const _SIDEBAR_MENU: SidebarMenuType[] = [
  {
    id: uuidv4(),
    name: "Profile",
    link: "/dashboard/profile",
    icon: UserIcon,
  },
  {
    id: uuidv4(),
    name: "History",
    link: "/dashboard/history",
    icon: ClockCounterClockwiseIcon,
  },
  {
    id: uuidv4(),
    name: "Favorites",
    link: "/dashboard/favorites",
    icon: ListHeartIcon,
  },
  {
    id: uuidv4(),
    name: "Notifications",
    link: "/dashboard/notifications",
    icon: BookmarkIcon,
  },
  {
    id: uuidv4(),
    name: "Badges",
    link: "/dashboard/badges",
    icon: ShieldChevronIcon,
  },
  {
    id: uuidv4(),
    name: "Leaderboard",
    link: "/dashboard/leaderboard",
    icon: CrownIcon,
  },
  {
    id: uuidv4(),
    name: "Support Tickets",
    link: "/dashboard/supports",
    icon: TicketIcon,
  },
  {
    id: uuidv4(),
    name: "Coin History",
    link: "/dashboard/coin-history",
    icon: CoinIcon,
  },
  {
    id: uuidv4(),
    name: "Withdraw",
    link: "/dashboard/withdraw",
    icon: MoneyWavyIcon,
  },
  {
    id: uuidv4(),
    name: "Buy Coins",
    link: "/dashboard/buy-coin",
    icon: CoinsIcon,
  },
  {
    id: uuidv4(),
    name: "Invite Friends",
    link: "/dashboard/invite-friends",
    icon: SignOutIcon,
  },
  {
    id: uuidv4(),
    name: "Settings",
    link: "/dashboard/settings",
    icon: GearFineIcon,
  },
];
