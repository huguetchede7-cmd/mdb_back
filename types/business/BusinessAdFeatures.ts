export interface BusinessAdFeatures {
    land_area?: string;
    number_of_rooms?: number;
    minimum_stay_duration?: number;
    has_security_guard?: boolean;
    has_surveillance_camera?: boolean;
    electricity_type?: boolean;
    meter_type?: 'sts' | 'mecanique';
    number_of_living_rooms?: number;
    water_type?: boolean;
    rental_deposit?: string;
    has_garden?: boolean;
    has_private_entry?: boolean;
    number_of_bathrooms?: number;
    has_private_terrace?: boolean;
    has_swimming_pool?: boolean;
    has_parking_or_garage?: boolean;
    cooling_type?: boolean;
    max_occupancy?: number;
    has_washing_machine?: boolean;
    has_kitchen?: boolean;
    has_wifi?: boolean;
    has_pets?: number;
    has_dryer?: boolean;
    children_allowed?: boolean;
    events_allowed?: boolean;
    smoking_policy?: boolean;
}