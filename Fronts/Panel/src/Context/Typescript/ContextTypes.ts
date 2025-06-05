import { SetStateAction } from "react"
import { CreateUserForm, LoginData, LoginUserForm } from "./AuthenticationTypes"
import { ClientInterface, FormClient } from "./ClientsTypes"
import { DebtForm, EditingData } from "./DebtsTypes"
import { DeliverForm, EditingDeliverData } from "./DeliversTypes"
import { FinancialClient } from "./FinancialTypes"
import { AccountSummary, MonthOption, SummaryCards } from "./ResumeTypes"
import { Business, BusinessForm, EditBusinessData, NotifOptions } from "./BusinessTypes"
import { errorTypesRequest, Expirations } from "./ExpirationsTypes"

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
    setSelectedClientData: React.Dispatch<SetStateAction<ClientInterface>>,
    openedBusinessModal: boolean,
    openBusinessModal: () => void,
    closeBusinessModal: () => void,
    editingBusinessData: EditBusinessData, 
    setEditingBusinessData: React.Dispatch<SetStateAction<EditBusinessData>>, 
    clearEditBusinessData: () => void
}

export interface AuthenticationHookInterface {
    loginData: LoginData,
    loginUser: (formValues: LoginUserForm) => Promise<void>,
    setLoginData: React.Dispatch<React.SetStateAction<LoginData>>,
    registerUser: (formValues: CreateUserForm) => Promise<boolean>
    validatingSession: boolean,
    logoutUser: () => Promise<void>
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
    saveDeliver: (deliverData: DeliverForm, isEditing?: boolean, deliverId?: string) => Promise<boolean>,
    editingDeliver: EditingDeliverData | null, 
    setEditingDeliver: React.Dispatch<SetStateAction<EditingDeliverData | null>>,
}

export interface FinancialClientHookInterface {
    financialClientData: FinancialClient,
    setFinancialClientData: React.Dispatch<React.SetStateAction<FinancialClient | any>>
    getFinancialClientData: () => Promise<boolean>,
    historyClientData: FinancialClient[]
}

export interface ResumeHookInterface {
    getMonthlyResume: () => Promise<boolean>,
    resumes: AccountSummary,
    summaryCards: SummaryCards[]
    monthsAvailable: MonthOption[]
}

export interface BusinessHookInterface {
    createBusiness: (formData: BusinessForm) => Promise<boolean | undefined>,
    editBusiness: (formData: BusinessForm, onClose: () => void, editBusinessInfo: EditBusinessData) => Promise<boolean | undefined>,
    notiOption: NotifOptions, 
    setNotiOption: React.Dispatch<SetStateAction<NotifOptions>>,
    changeNotificationOption: (option: NotifOptions, business_id: string) => Promise<boolean>
    getBusinesInfo: () => Promise<boolean>, 
    setBusinesData: React.Dispatch<SetStateAction<Business | null>>, 
    businesData: Business | null
}

export interface NotificationsHookInterface{
    sendNotification: (client_id: string) => Promise<boolean>
}

export interface ExpirationsHookInterface {
    getExpirations: () =>  Promise<{ errorType: errorTypesRequest, error: boolean }>, 
    expirations: Expirations[]
}
export interface AppContextValueInterface {
    width: number,
    modalsHook: ModalsHookInterface,
    authHook: AuthenticationHookInterface,
    clientsHook: ClientsHookInterface,
    debtsHook: DebtsHookInterface,
    deliversHook: DeliversHookInterface,
    financialClientHook: FinancialClientHookInterface,
    resumeHook: ResumeHookInterface,
    getInitials: (fullName: string) => string,
    businessHook: BusinessHookInterface,
    notificationsHook: NotificationsHookInterface,
    expirationsHook: ExpirationsHookInterface
}