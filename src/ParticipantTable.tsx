import { IParticipant } from "./types/IParticipant.ts";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { Button, Flex, Spin } from "antd";
import { ParticipantButton } from "./ParticipantButton.tsx";
import { useTranslation } from "react-i18next";

interface IParticipantTableProps {
  participants?: IParticipant[] | null;
  setRound: Dispatch<SetStateAction<number>>;
  round: number;
}

export const ParticipantTable: FC<IParticipantTableProps> = ({
  participants,
  setRound,
  round,
}) => {
  const { t } = useTranslation();
  const [turn, setTurn] = useState<number>(1);

  if (!participants) return <Spin />;

  const handleNextClick = () => {
    if (turn === participants.length) {
      setTurn(1);
      setRound((round) => round + 1);
      return;
    }
    setTurn(turn + 1);
  };

  const handlePreviousClick = () => {
    if (turn > 1) {
      setTurn(turn - 1);
      return;
    }
    if (round === 1) {
      setTurn(1);
      return;
    }
    setTurn(participants.length);
    setRound((round) => round - 1);
  };

  return (
    <>
      <Flex vertical gap={"middle"} style={{ width: 300 }}>
        {participants
          .sort((a, b) => b.initiative - a.initiative)
          .map((participant: IParticipant, index) => (
            <ParticipantButton
              key={participant.id}
              participant={participant}
              index={index}
              turn={turn - 1}
            />
          ))}
      </Flex>
      <Flex justify={"space-between"} style={{ width: 300, marginTop: 24 }}>
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
