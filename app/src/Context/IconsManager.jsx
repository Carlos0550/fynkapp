import OpenEyeIcon from "../assets/icons/OpenEyeIcon.svg"
import CloseEyeIcon from "../assets/icons/CloseEyeIcon.svg"
import WalletIcon from "../assets/icons/WalletIcon.svg"
import SettingsIcon from "../assets/icons/SettingsIcon.svg"
import IconsManagger from "../assets/icons/PaymentIcon.svg"
import PersonAddIcon  from "../assets/icons/PersonAddIcon.svg"
import DashboardIcon from "../assets/icons/DashboardIcon.svg"
import PersonGroupIcon from "../assets/icons/ClientsGroupIcon.svg"

export const Icons = {
    icons: {
        openEye: <picture 
            style={{
                maxWidth: "40px",
                maxHeight: "40px"
            }}
            className="icons-icon-picture"><img src={OpenEyeIcon}/></picture>,
        closeEye: <picture 
            style={{
                maxWidth: "40px",
                maxHeight: "40px"
            }}
            className="icons-icon-picture"><img src={CloseEyeIcon}/></picture>,
        WalletIcon: <picture 
            style={{
                maxWidth: "40px",
                maxHeight: "40px",
                width: "100%"
            }}
            className="icons-icon-picture"><img src={WalletIcon}/></picture>,
        SettingsIcon: <picture 
            style={{
                maxWidth: "40px",
                maxHeight: "40px",
                width: "100%"
            }}
            className="icons-icon-picture"><img src={SettingsIcon}/></picture>,
        PaymentIcon: <picture 
            style={{
                maxWidth: "40px",
                maxHeight: "40px",
                width: "100%"
            }}
            className="icons-icon-picture"><img src={IconsManagger}/></picture>,
        PersonAdd: <picture 
            style={{
                maxWidth: "40px",
                maxHeight: "40px",
                width: "100%"
            }}
            className="icons-icon-picture"><img src={PersonAddIcon}/></picture>,
        Dashboard: <picture 
            style={{
                maxWidth: "40px",
                maxHeight: "40px",
                width: "100%"
            }}
            className="icons-icon-picture"><img src={DashboardIcon}/></picture>,
        ClientsGroup: <picture 
            style={{
                maxWidth: "40px",
                maxHeight: "40px",
                width: "100%"
            }}
            className="icons-icon-picture"><img src={PersonGroupIcon}/></picture>,
    }}