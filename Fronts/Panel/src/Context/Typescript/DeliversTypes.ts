export interface DeliverForm{
    deliver_amount: string,
    deliver_date: string,
    deliver_details: string
}

export interface EditingDeliverData extends DeliverForm{
    deliver_id: string
    isEditing: boolean
}