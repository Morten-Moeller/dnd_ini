import { IParticipant } from "./types/IParticipant.ts";
import { CSSProperties, FC, useState } from "react";
import { Button, Divider, Flex, theme, Typography } from "antd";

interface IParticipantButtonProps {
  participant: IParticipant;
  index: number;
  turn: number;
  handleIsDead: (participant: IParticipant, isDead: boolean) => void;
  style?: CSSProperties;
}

export const ParticipantButton: FC<IParticipantButtonProps> = ({
  participant,
  index,
  turn,
  handleIsDead,
  style,
}) => {
  const [isDead, setIsDead] = useState(participant.isDead);
  const { Text } = Typography;
  const { useToken } = theme;
  const { token } = useToken();

  const handleClick = () => {
    setIsDead(!isDead);
    handleIsDead(participant, !isDead);
  };

  return (
    <Button
      type={turn === index ? "primary" : "default"}
      onClick={handleClick}
      style={isDead ? { backgroundColor: token.colorErrorBg, ...style } : style}
    >
      <Flex gap={"small"} justify={"space-between"} align={"center"}>
        <Text>{index + 1})</Text>
        <Text>{participant.name}</Text>
        <div>
          <Divider type={"vertical"} />
          <Text>{participant.initiative}</Text>
        </div>
      </Flex>
    </Button>
  );
};
