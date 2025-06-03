export interface BusinessForm {
    business_name: string,
    business_address: string,
    business_phone: string
}

export interface Business extends BusinessForm{
    business_id?: string
    manager_business_id?: string
}

export interface EditBusinessData extends Business{
    isEditing: boolean
}

export type NotifOptions = 'whatsapp' | 'email' | 'both'