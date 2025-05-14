import { LoginData, LoginUserForm } from "./AuthenticationTypes"

export interface ModalsHookInterface {
    openedClientModal: boolean,
    openClientModal: () => void,
    closeClientModal: () => void,
    openedAddDeliverModal : boolean,
    openDeliverModal: () => void,
    closeDeliverModal: () => void,
    openedAddDebtModal: boolean,
    openDebtModal: () => void,
    closeDebtModal: () => void,
    openedAddClientModal: boolean,
    openAddClientModal: () => void,
    closeAddClientModal: () => void
}

export interface AuthenticationHookInterface {
    loginData: LoginData,
    loginUser: (formValues: LoginUserForm) => Promise<void>
}

export interface AppContextValueInterface {
    width: number,
    modalsHook: ModalsHookInterface,
    authHook: AuthenticationHookInterface
}