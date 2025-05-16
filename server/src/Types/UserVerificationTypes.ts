export interface UserVerification{
    manager_id: string,
    link_id: string,
}

export interface LinkData{
    manager_id: string,
    link_id: string,
    created_at: string,
    expires_at: string,
    link_type: "verification" | "recovery",
    used: boolean
}