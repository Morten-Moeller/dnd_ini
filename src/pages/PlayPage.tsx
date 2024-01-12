import { FC, useEffect, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Spin,
  Typography,
} from "antd";
import { useTranslation } from "react-i18next";
import { GroupFields } from "../types/GroupFields.ts";
import { IGroup } from "../types/IGroup.ts";
import { LocalStorageKeys } from "../types/LocalStorageKeys.ts";
import { fromLocalStorage, toLocalStorage } from "../utils/localStorage.ts";
import { useNavigate } from "react-router-dom";
import { ICharacter } from "../types/ICharacter.ts";
import { IParticipant } from "../types/IParticipant.ts";
import { ParticipantTable } from "../ParticipantTable.tsx";
import { ParticipantKeys } from "../types/ParticipantKeys.ts";
import { v4 as uuidv4 } from "uuid";
import { IParticipantGroup } from "../types/IParticipantGroup.ts";
import { ParticipantsGroupFields } from "../types/ParticipantsGroupFields.ts";

export const PlayPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [group, setGroup] = useState<IGroup | null>(null);
  const [roundCounter, setRoundCounter] = useState(1);
  const [turn, setTurn] = useState(1);
  const [showDead, setShowDead] = useState<boolean>(true);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [participantsGroup, setParticipantsGroup] =
    useState<IParticipantGroup | null>(null);

  useEffect(() => {
    if (!participantsGroup || !group) return;
    toLocalStorage(
      `${LocalStorageKeys.Participants}_${group[GroupFields.GroupName]}`,
      participantsGroup,
    );
  }, [participantsGroup, group]);

  useEffect(() => {
    if (!group) return;
    const participants = fromLocalStorage(
      `${LocalStorageKeys.Participants}_${group[GroupFields.GroupName]}`,
    );
    if (participants) setParticipantsGroup(participants);
  }, [group]);

  useEffect(() => {
    const group = fromLocalStorage(LocalStorageKeys.Group);
    if (group) setGroup(group);
    const participantsGroup = fromLocalStorage(
      `${LocalStorageKeys.Participants}_${group[GroupFields.GroupName]}`,
    );
    if (participantsGroup) return setParticipantsGroup(participantsGroup);
    const newParticipantsGroup: IParticipantGroup = {
      groupName: group[GroupFields.GroupName], // Der Gruppenname aus dem `group` Objekt
      participants: group[GroupFields.Characters].map(
        (character: ICharacter) => ({
          name: character.name,
          initiative: 0,
          isDead: false,
          id: uuidv4(),
          isCharacter: true,
        }),
      ),
    };
    setParticipantsGroup(newParticipantsGroup);
  }, []);

  if (!group || !participantsGroup) return <Spin />;

  const addItem = (values: { name: string; initiative: number }) => {
    if (!participantsGroup) return;

    const newParticipant: IParticipant = {
      name: values.name,
      initiative: values.initiative,
      isDead: false,
      id: uuidv4(),
    };

    const updatedParticipantsGroup: IParticipantGroup = {
      ...participantsGroup,
      participants: [...participantsGroup.participants, newParticipant],
    };

    toLocalStorage(
      `${LocalStorageKeys.Participants}_${group[GroupFields.GroupName]}`,
      updatedParticipantsGroup,
    );
    setParticipantsGroup(updatedParticipantsGroup);
  };

  const handleIniChange = (value: number | null, name: string) => {
    if (!participantsGroup || value === null) return;

    const updatedParticipants = participantsGroup[
      ParticipantsGroupFields.Participants
    ].map((participant) => {
      if (participant.name === name) {
        return { ...participant, initiative: value };
      }
      return participant;
    });

    const updatedParticipantsGroup: IParticipantGroup = {
      ...participantsGroup,
      participants: updatedParticipants,
    };

    setParticipantsGroup(updatedParticipantsGroup);
  };

  const clearParticipants = () => {
    if (!participantsGroup) return;
    const newParticipantsGroup: IParticipantGroup = {
      groupName: group[GroupFields.GroupName], // Der Gruppenname aus dem `group` Objekt
      participants: group[GroupFields.Characters].map(
        (character: ICharacter) => ({
          name: character.name,
          initiative: 0,
          isDead: false,
          id: uuidv4(),
        }),
      ),
    };
    setParticipantsGroup(newParticipantsGroup);
    setRoundCounter(1);
    setTurn(1);
  };

  const handleIsDead = (participant: IParticipant, isDead: boolean) => {
    if (!participantsGroup) return;

    const updatedParticipants = participantsGroup.participants.map((p) => {
      if (p.id === participant.id) {
        return { ...p, isDead };
      }
      return p;
    });

    const updatedParticipantsGroup: IParticipantGroup = {
      ...participantsGroup,
      participants: updatedParticipants,
    };

    setParticipantsGroup(updatedParticipantsGroup);
  };

  const handleDeleteParticipant = (idToDelete: string) => {
    if (!participantsGroup) return;
    const updatedParticipants = participantsGroup.participants.filter(
      (participant: IParticipant) => participant.id !== idToDelete,
    );
    setParticipantsGroup({
      [ParticipantsGroupFields.GroupName]:
        participantsGroup[ParticipantsGroupFields.GroupName],
      [ParticipantsGroupFields.Participants]: updatedParticipants,
    });
  };

  return (
    <main style={{ minHeight: 400, maxWidth: 900, width: "100%" }}>
      <Flex vertical>
        <Flex justify={"space-between"}>
          <Button onClick={() => navigate("/")}>{t("Back")}</Button>
          <Typography.Title style={{ margin: 0 }} level={2}>
            {group[GroupFields.GroupName]}
          </Typography.Title>
          <Button onClick={clearParticipants}>{t("Clear")}</Button>
        </Flex>
        <Typography.Title
          level={4}
          style={{ textAlign: "center", margin: "8px 0 24px 0" }}
        >
          {t("Round")}: {roundCounter}
        </Typography.Title>
        <Flex gap={"middle"}>
          <section style={{ flexBasis: 450 }}>
            <Card style={{ minHeight: 400 }}>
              <ParticipantTable
                handleIsDead={handleIsDead}
                participants={participantsGroup.participants}
                setRound={setRoundCounter}
                round={roundCounter}
                turn={turn}
                setTurn={setTurn}
                showDead={showDead}
                isEdit={isEdit}
                onRemoveParticipant={handleDeleteParticipant}
              />
            </Card>
          </section>
          <aside style={{ flex: 1 }}>
            <Card style={{ minHeight: 400 }}>
              <Form layout={"vertical"} onFinish={addItem}>
                <Flex gap={"small"} style={{ marginBottom: 12 }}>
                  <Form.Item
                    name={ParticipantKeys.Name}
                    label={t("Name")}
                    style={{ flex: 3, margin: 0 }}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={ParticipantKeys.Initiative}
                    label={t("Init")}
                    style={{ flex: 1, margin: 0 }}
                  >
                    <InputNumber />
                  </Form.Item>
                </Flex>
                <Button htmlType="submit" style={{ width: "100%" }}>
                  {t("Add")}
                </Button>
              </Form>
              <Divider />
              <Form layout={"vertical"}>
                <Button onClick={() => setShowDead(!showDead)}>
                  {showDead ? t("HideDead") : t("ShowDead")}
                </Button>
                <Button onClick={() => setIsEdit(!isEdit)}>
                  {t("EditParticipants")}
                </Button>
                <Flex vertical gap={"middle"}>
                  {group[GroupFields.Characters].map((character, index) => (
                    <Flex
                      key={character.name}
                      justify={"end"}
                      gap={"middle"}
                      align={"center"}
                    >
                      <Typography.Text>{character.name}</Typography.Text>
                      <Form.Item key={index} style={{ margin: 0, width: 80 }}>
                        <InputNumber
                          controls={false}
                          onChange={(value) =>
                            handleIniChange(value as number, character.name)
                          }
                        />
                      </Form.Item>
                    </Flex>
                  ))}
                </Flex>
              </Form>
            </Card>
          </aside>
        </Flex>
      </Flex>
    </main>
  );
};
