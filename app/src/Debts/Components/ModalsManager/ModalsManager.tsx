import React from 'react';
import ClientDebtsFormModal from '../ClientDebtsFormModal';
import ClientDeliversFormModal from '../ClientDeliversFormModal';
import { ClientsInterface } from '../../../Context/Typescript/ClientsTypes';
interface ModalsManagerProps {
  clientData: ClientsInterface;
  showFormModal: boolean;
  showDeliversFormModal: boolean;
  onCloseFormModal: () => void;
  onCloseDeliversFormModal: () => void;
}

export function ModalsManager({ clientData, showFormModal, showDeliversFormModal, onCloseFormModal, onCloseDeliversFormModal }: ModalsManagerProps) {
  return (
    <>
      {showFormModal && <ClientDebtsFormModal clientData={clientData} closeModal={onCloseFormModal} />}
      {showDeliversFormModal && <ClientDeliversFormModal clientData={clientData} closeModal={onCloseDeliversFormModal} />}
    </>
  );
}