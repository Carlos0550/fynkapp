import { useAppContext } from '../../../../../../Context/AppContext'
import { IoIosCloseCircle } from "react-icons/io";

import "./ClientFinancialData.css"
import { Skeleton } from '@mantine/core';
function ClientFinancialData({closeModal}) {
    const {
        modalsHook: {
            selectedClientData,
        }
    } = useAppContext()

    return (
        <div className='financial-container'>
            <IoIosCloseCircle 
                size={30} 
                className='financial-close-icon'
                onClick={()=> closeModal()}
            />
            <h2>{selectedClientData.client_name}</h2>
            <Skeleton width={550} height={15} animate m={10}/>
            <Skeleton width={550} height={15} animate m={10}/>
            <Skeleton width={550} height={15} animate m={10}/>
            <Skeleton width={550} height={15} animate m={10}/>
        </div>
    )
}

export default ClientFinancialData
