import { Tabs, rem } from '@mantine/core'
import DebtTable from './DebtTable'
import DeliversTable from './DeliversTable'
import HistoryTable from './HistoryTable'

function FinancialTabs() {
    return (
        <Tabs defaultValue="debts" radius="md" variant="default" style={{ marginTop: rem(10) }}>
            <Tabs.List grow>
                <Tabs.Tab value="debts">Deudas</Tabs.Tab>
                <Tabs.Tab value="payments">Pagos</Tabs.Tab>
                <Tabs.Tab value="history">Historial</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="debts" pt="md">
                <DebtTable/>
            </Tabs.Panel>

            <Tabs.Panel value="payments" pt="md">
                <DeliversTable/>
            </Tabs.Panel>

            <Tabs.Panel value="history" pt="md">
                <HistoryTable/>
            </Tabs.Panel>
        </Tabs>
    )
}

export default FinancialTabs
