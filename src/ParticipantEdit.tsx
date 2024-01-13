import { Button, Flex, InputNumber } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { FC, useEffect, useState } from "react";
import { IParticipant } from "./types/IParticipant.ts";

interface IParticipantEditProps {
  participant: IParticipant;
  onRemoveParticipant: (idToDelete: string) => void;
  onIniChange: (ini: number | null, id: string) => void;
}
export const ParticipantEdit: FC<IParticipantEditProps> = ({
  participant,
  onRemoveParticipant,
  onIniChange,
}) => {
  const [ini, setIni] = useState<number | null>(participant.initiative);

  useEffect(() => {
    setIni(participant.initiative);
  }, [participant]);

  const handleIniChange = (ini: number | null) => {
    onIniChange(ini, participant.id);
    setIni(ini);
  };

  if (participant.isCharacter) return null;

  return (
    <Flex gap={"middle"}>
      <InputNumber value={ini} onChange={handleIniChange} />
      <Button
        onClick={() => onRemoveParticipant(participant.id)}
        icon={<DeleteOutlined />}
      />
    </Flex>
  );
};
