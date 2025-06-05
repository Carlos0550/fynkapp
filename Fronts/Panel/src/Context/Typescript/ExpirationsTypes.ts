export interface Expirations{
    expired_id: number
    expired_client_id: string
    expired_business_id: string
    expired_amount: number
    expired_date: string
}
export type errorTypesRequest = "noExpirations" | "noBusinessId" | "noError" | "serverError"