export interface Page {
  id: number;
  slug: string;
}
export interface MenuItem {
  title: string;
  url: string | null;
  id: number;
  parent_id: number | null;
  menu_id: string;
  page_id: string;
  children: MenuItem[]; // Recursive nesting
  page: Page;
  order: number;
}

export interface MenuGroup {
  name: string;
  slug: string;
  id: number;
  items: MenuItem[];
}

export interface MenuResponse {
  statusCode: number;
  data: MenuGroup[];
}
