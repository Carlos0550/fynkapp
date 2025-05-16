export interface ManagerData{
    manager_id: string,
    manager_name: string,
    manager_email: string,
    manager_password: string,
    manager_verified: boolean,
    token?: string
}

export interface LoginUserForm{
    user_email: string,
    user_password: string
}

export interface CreateUserForm extends LoginUserForm{
    user_name: string,
    confirm_password: string
}