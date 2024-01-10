import { IParticipant } from "./types/IParticipant.ts";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { Button, Flex, Spin } from "antd";
import { ParticipantButton } from "./ParticipantButton.tsx";
import { useTranslation } from "react-i18next";

interface IParticipantTableProps {
  participants?: IParticipant[] | null;
  setRound: Dispatch<SetStateAction<number>>;
  round: number;
  turn: number;
  setTurn: Dispatch<SetStateAction<number>>;
  handleIsDead: (participant: IParticipant, isDead: boolean) => void;
}

export const ParticipantTable: FC<IParticipantTableProps> = ({
  participants,
  setRound,
  round,
  turn,
  setTurn,
  handleIsDead,
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
      setRound((round) => round + 1);
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
      setRound((round) => round - 1);
    }
  };

  return (
    <>
      <Flex vertical gap={"middle"} style={{ width: 400 }}>
        {participants
          .sort((a, b) => b.initiative - a.initiative)
          .map((participant: IParticipant, index) => (
            <ParticipantButton
              handleIsDead={handleIsDead}
              key={participant.id}
              participant={participant}
              index={index}
              turn={turn - 1}
            />
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
