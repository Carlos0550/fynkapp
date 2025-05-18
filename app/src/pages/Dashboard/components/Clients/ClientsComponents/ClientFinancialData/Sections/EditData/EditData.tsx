import React from 'react'
import ClientForm from '../../../ClientForm/ClientForm'
import useClientFData from '../../utils/useClientFData'
import { FaArrowCircleLeft } from "react-icons/fa";
import "./EditData.css"
import { useAppContext } from '../../../../../../../../Context/AppContext';
function EditData({ closeModal, setSections }) {
    const {
        modalsHook:{
            selectedClientData
        },
        clientsHook:{
            setEditingClient
        }
    } = useAppContext()
  return (
    <div className='edit-data-container'>
        <FaArrowCircleLeft
            size={25}
            color='#2c2c2c'
            className='edit-data-back-icon'
            onClick={() => {
                setSections("home")
                setEditingClient(false)
            }}
        />
        <p className='edit-data-title'>Editando datos de {selectedClientData.client_name}</p>
        <ClientForm closeModal={closeModal}/>
    </div>
  )
}

export default EditData
