export interface UserRegisterFormValuesInterface{
    user_email: string,
    user_password: string,
    user_name: string,
    user_last_name: string,
    confirm_password: string
}

export interface UserLoginFormValuesInterface{
    user_email: string,
    user_password: string
}

export interface LoginDataInterface{
    user_id: string,
    user_name: string,
    user_last_name: string,
    user_email: string,
    
}