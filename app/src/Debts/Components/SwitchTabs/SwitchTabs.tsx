import React from 'react';
import { Tabs } from '@mantine/core';

interface SwitchTabsProps {
  onChange: (value: "debts" | "payments" | "history") => void;
}

export function SwitchTabs({ onChange }: SwitchTabsProps) {
  return (
    <div className="switch-container">
      <Tabs color='red' defaultValue="debts" onChange={onChange}>
        <Tabs.List>
          <Tabs.Tab value='debts'>Deudas</Tabs.Tab>
          <Tabs.Tab value='payments'>Pagos</Tabs.Tab>
          <Tabs.Tab value='history'>Historial</Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </div>
  );
}