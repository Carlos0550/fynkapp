import React from 'react'
import ClientForm from '../../../ClientForm/ClientForm'
import useClientFData from '../../utils/useClientFData'
import { FaArrowCircleLeft } from "react-icons/fa";
import "./EditData.css"
import { useAppContext } from '../../../../../../../../Context/AppContext';
function EditData({ closeModal }) {
    const {
        modalsHook:{
            selectedClientData
        }
    } = useAppContext()
  return (
    <div className='edit-data-container'>
        
        <p className='edit-data-title'>Editando datos de {selectedClientData.client_name}</p>
        <ClientForm closeModal={closeModal}/>
    </div>
  )
}

export default EditData
