export interface BusinessRequest{
    business_name: string,
    business_phone: string,
    business_address: string
}

export interface BusinessData extends BusinessRequest{
    business_id: string,
    manager_business_id: string,
    notif_option: "email" | "whatsapp" | "both"
}