export interface DeliverDataInterface{
    deliver_id?: string,
    deliver_user_id?: string,
    deliver_client_id: string,
    deliver_amount: string,
    deliver_date: Date
}

export interface EditDeliverHookInterface{
    deliverID: string,
    isEditing: boolean
    deliverData: DeliverDataInterface
}