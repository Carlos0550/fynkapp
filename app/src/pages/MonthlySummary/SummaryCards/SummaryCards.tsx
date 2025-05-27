import { Card, Flex, Text, ThemeIcon } from "@mantine/core";

interface Props {
  summary_name: string;
  summary_icon: React.ReactNode
  summary_value: string;
  summary_color: string;
  summary_leyend_color: string
}

function SummaryCards({
  summary_color,
  summary_icon,
  summary_name,
  summary_value,
}: Props) {
  return (
    <Card  shadow="sm" padding="lg" radius="md" style={{ width: 320 }}>
      <Flex direction="column" gap="xs">
        <Flex justify="space-between" align="center">
          <Text fw={600} size="sm" c="dimmed">
            {summary_name}
          </Text>
          <ThemeIcon color="gray" size="lg" radius="xl"  style={{ backgroundColor: summary_color }}>
            <Text>{summary_icon}</Text>
          </ThemeIcon>
        </Flex>
        <Text fw={700} size="xl">
          {summary_value}
        </Text>

      </Flex>
    </Card>
  );
}

export default SummaryCards;
