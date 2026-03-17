import { AdSuperCategoryType } from "./AdSuperCategoryType";

export type AdCategorieType = {
  icon: string;
  id: number;
  tag: string;
  label: string;
  super_ads_category_id: number;
  description: string;
  superCategory ?: AdSuperCategoryType;
};

