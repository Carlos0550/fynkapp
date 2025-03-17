import React from 'react';
import { Button } from '@mantine/core';
import { MdOutlineAccountBalanceWallet, MdPayments } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

interface ClientActionsProps {
  totalDebtAmount: number;
  clientDebts: any[];
  onAddDebt: () => void;
  onRegisterPayment: () => void;
  onClearAccount: () => void;
}

export function ClientActions({ totalDebtAmount, clientDebts, onAddDebt, onRegisterPayment, onClearAccount }: ClientActionsProps) {
  return (
    <div className="client-data-actions">
      <Button color='dark' onClick={onAddDebt}><MdOutlineAccountBalanceWallet /> Agregar deuda</Button>
      <Button disabled={totalDebtAmount === 0} color='dark' onClick={onRegisterPayment}><MdPayments /> Registrar pago</Button>
      <Button onClick={onClearAccount} disabled={totalDebtAmount !== 0 || clientDebts.length === 0} color='red'><FaTrash /> Vaciar cuenta</Button>
    </div>
  );
}