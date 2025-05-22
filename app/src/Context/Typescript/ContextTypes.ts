import { SetStateAction } from "react"
import { CreateUserForm, LoginData, LoginUserForm } from "./AuthenticationTypes"
import { ClientInterface, FormClient } from "./ClientsTypes"
import { DebtForm, EditingData } from "./DebtsTypes"
import { DeliverForm } from "./DeliversTypes"
import { FinancialClient } from "./FinancialTypes"

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
    closeAddClientModal: () => void,
    selectedClientData: ClientInterface,
    clearClientData: () => void,
    setSelectedClientData: React.Dispatch<SetStateAction<ClientInterface>>
}

export interface AuthenticationHookInterface {
    loginData: LoginData,
    loginUser: (formValues: LoginUserForm) => Promise<void>,
    registerUser: (formValues: CreateUserForm) => Promise<boolean>
    validatingSession: boolean
}

export interface ClientsHookInterface {
    clients: ClientInterface[],
    setClients: React.Dispatch<React.SetStateAction<ClientInterface[]>>,
    saveClient: (formData: FormClient) => Promise<boolean>,
    getAllClients: () => Promise<boolean>,
    getClientData: () => Promise<boolean | ClientInterface>,
    editingClient: boolean, 
    setEditingClient: React.Dispatch<React.SetStateAction<boolean>>,
    deleteClient: () => Promise<boolean>
}

export interface DebtsHookInterface {
    saveDebt: (debtData: DebtForm) => Promise<boolean>
    editingDebt: EditingData | null, 
    setEditingDebt: React.Dispatch<SetStateAction<EditingData | null>>,
    deleteDebt: (debt_id: string) => Promise<boolean>
}

export interface DeliversHookInterface {
    saveDeliver: (deliverData: DeliverForm) => Promise<boolean>
}

export interface FinancialClientHookInterface {
    financialClientData: FinancialClient,
    setFinancialClientData: React.Dispatch<React.SetStateAction<FinancialClient | any>>
    getFinancialClientData: () => Promise<boolean>,
    historyClientData: FinancialClient[]
}
export interface AppContextValueInterface {
    width: number,
    modalsHook: ModalsHookInterface,
    authHook: AuthenticationHookInterface,
    clientsHook: ClientsHookInterface,
    debtsHook: DebtsHookInterface,
    deliversHook: DeliversHookInterface,
    financialClientHook: FinancialClientHookInterface
}