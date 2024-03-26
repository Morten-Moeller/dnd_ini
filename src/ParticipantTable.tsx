import { IParticipant } from "./types/IParticipant.ts";
import { FC } from "react";
import { Button, Flex, Spin } from "antd";
import { ParticipantButton } from "./ParticipantButton.tsx";
import { useTranslation } from "react-i18next";
import { ParticipantEdit } from "./ParticipantEdit.tsx";

interface IParticipantTableProps {
  participants?: IParticipant[] | null;
  setRound: (round: number) => void;
  round: number;
  turn: number;
  setTurn: (turn: number) => void;
  handleIsDead: (participant: IParticipant, isDead: boolean) => void;
  showDead: boolean;
  isEdit: boolean;
  onRemoveParticipant: (idToDelete: string) => void;
  onIniChange: (ini: number | null, id: string) => void;
}

export const ParticipantTable: FC<IParticipantTableProps> = ({
  participants,
  setRound,
  round,
  turn,
  setTurn,
  handleIsDead,
  showDead,
  isEdit,
  onRemoveParticipant,
  onIniChange,
}) => {
  const { t } = useTranslation();

  if (!participants) return <Spin />;

  const handleNextClick = () => {
    let newTurn = turn;
    const totalParticipants = participants.length || 0;
    let count = 0; // Zähler für die Durchgänge

    while (count < totalParticipants) {
      newTurn = newTurn >= totalParticipants ? 1 : newTurn + 1;
      if (newTurn === turn || !participants[newTurn - 1].isDead) {
        break;
      }

      count++;
    }
    if (count === totalParticipants) {
      return;
    }
    setTurn(newTurn);

    if (newTurn === 1) {
      setRound(round + 1);
    }
  };

  const handlePreviousClick = () => {
    let newTurn = turn;
    const totalParticipants = participants.length || 0;
    let count = 0; // Zähler für die Durchgänge

    while (count < totalParticipants) {
      newTurn = newTurn <= 1 ? totalParticipants : newTurn - 1;

      if (newTurn === turn || !participants[newTurn - 1].isDead) {
        break;
      }
      count++;
    }
    if (count === totalParticipants) {
      return;
    }
    setTurn(newTurn);

    if (newTurn === totalParticipants) {
      setRound(round - 1);
    }
  };

  const filterDead = (participants: IParticipant) => {
    if (showDead) {
      return true;
    }
    return !participants.isDead;
  };

  return (
    <>
      <Flex vertical gap={"middle"} style={{ width: 400 }}>
        {participants
          .sort((a, b) => b.initiative - a.initiative)
          .filter(filterDead)
          .map((participant: IParticipant, index) => (
            <Flex gap={"middle"} key={participant.id}>
              <ParticipantButton
                style={{ flex: 1 }}
                disabled={isEdit && participant.isCharacter}
                handleIsDead={handleIsDead}
                participant={participant}
                index={index}
                turn={turn - 1}
                mode={isEdit && !participant.isCharacter ? "edit" : "play"}
              />
              {isEdit && (
                <ParticipantEdit
                  participant={participant}
                  onIniChange={onIniChange}
                  onRemoveParticipant={() =>
                    onRemoveParticipant(participant.id)
                  }
                />
              )}
            </Flex>
          ))}
      </Flex>
      <Flex justify={"space-between"} style={{ width: 400, marginTop: 24 }}>
        <Button
          disabled={round === 1 && turn === 1}
          onClick={handlePreviousClick}
        >
          {t("Previous")}
        </Button>
        <Button onClick={handleNextClick}>{t("Next")}</Button>
      </Flex>
    </>
  );
};
