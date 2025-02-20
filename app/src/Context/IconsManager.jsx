import OpenEyeIcon from "../assets/icons/OpenEyeIcon.svg"
import CloseEyeIcon from "../assets/icons/CloseEyeIcon.svg"

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
    }
}