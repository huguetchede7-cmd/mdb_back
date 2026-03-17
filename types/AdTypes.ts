import { AdCategorieType } from './AdCategorieType'
import { AdCityType } from './AdCityType'
import { AdCountryType } from './AdCountryType'
import { AdDepartementType } from './AdDepartementType'
import { AdFeatureTypes } from './AdFeatureTypes'
import { AdSuperCategoryType } from './AdSuperCategoryType'

export interface AdType {
  images: { [key: string]: string }
  id: number
  name: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  slug: string
  description: string
  ad_type: 'sale' | 'rent'
  price_type: 'fixed' | 'negotiable'
  quantity: number
  price: number
  videos: string | null
  is_negotiable: boolean
  is_available: boolean
  super_category_id: number
  category_id: number
  company_id: number
  city_id: number
  department_id: number
  country_id: number
  address: string
  longitude: number | null
  latitude: number | null
  verified_by: number
  verified_at: string
  features?: AdFeatureTypes[]
  adsSuperCategory?: AdSuperCategoryType
  adsCategory?: AdCategorieType
  adsCompany?: {
    logo_path: string
    name: string
    address: string
    longitude: string | null
    latitude: string | null
    city: string
    country: string
    phone_number: string
    email: string
    website: string
    description: string
    ifu: string | null
  }
  adsCity?: AdCityType
  adsDepartment?: AdDepartementType
  adsCountry?: AdCountryType
  [key: string]: unknown
}
