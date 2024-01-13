import { IParticipant } from "./types/IParticipant.ts";
import { CSSProperties, FC, useState } from "react";
import { Button, Divider, Flex, theme, Typography } from "antd";

interface IParticipantButtonProps {
  participant: IParticipant;
  index: number;
  turn: number;
  handleIsDead: (participant: IParticipant, isDead: boolean) => void;
  disabled?: boolean;
  style?: CSSProperties;
  mode?: "edit" | "play";
}

export const ParticipantButton: FC<IParticipantButtonProps> = ({
  participant,
  index,
  turn,
  handleIsDead,
  disabled,
  style,
  mode = "play",
}) => {
  const [isDead, setIsDead] = useState(participant.isDead);
  const { Text } = Typography;
  const { useToken } = theme;
  const { token } = useToken();
  const isEditMode = mode === "edit";

  const handleClick = () => {
    setIsDead(!isDead);
    handleIsDead(participant, !isDead);
  };

  return (
    <Button
      disabled={disabled}
      type={turn === index ? "primary" : "default"}
      onClick={handleClick}
      style={isDead ? { backgroundColor: token.colorErrorBg, ...style } : style}
    >
      <Flex gap={"small"} justify={"space-between"} align={"center"}>
        <Text>{index + 1})</Text>
        <Text>{participant.name}</Text>
        {!isEditMode && (
          <div>
            <Divider type={"vertical"} />
            <Text>{participant.initiative}</Text>
          </div>
        )}
      </Flex>
    </Button>
  );
};
