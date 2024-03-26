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
  const [nameIncrement, setNameIncrement] = useState({
    name: "",
    number: 0,
  });
  const [gameStats, setGameStats] = useState({
    round: 1,
    turn: 1,
  });
  const [layoutOptions, setLayoutOptions] = useState({
    showDead: true,
    isEdit: false,
    hideMenu: false,
  });
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
    const player = group[GroupFields.Characters].map(
      (character: ICharacter) => ({
        name: character.name,
        initiative: 0,
        isDead: false,
        id: uuidv4(),
        isCharacter: true,
      }),
    );
    const newParticipantsGroup: IParticipantGroup = {
      [ParticipantsGroupFields.GroupName]: group[GroupFields.GroupName], // Der Gruppenname aus dem `group` Objekt
      [ParticipantsGroupFields.Participants]: player,
      [ParticipantsGroupFields.Player]: player,
    };
    setParticipantsGroup(newParticipantsGroup);
  }, []);

  if (!group || !participantsGroup) return <Spin />;

  const addItem = (values: { name: string; initiative: number }) => {
    if (!participantsGroup || !values.name) return;
    let updatedIncrement = nameIncrement.number + 1;
    if (nameIncrement.name.toLowerCase() !== values.name.toLowerCase()) {
      setNameIncrement({ name: values.name, number: 1 });
      updatedIncrement = 1;
    } else {
      setNameIncrement({ ...nameIncrement, number: updatedIncrement });
    }

    const newParticipant: IParticipant = {
      name: `${values.name} ${updatedIncrement}`,
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

  const handleIniChange = (value: number | null, id: string) => {
    if (!participantsGroup || value === null)
      return console.log(value, participantsGroup);

    const updatedParticipants = participantsGroup[
      ParticipantsGroupFields.Participants
    ].map((participant) => {
      if (participant.id === id) {
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
    const player = group[GroupFields.Characters].map(
      (character: ICharacter) => ({
        name: character.name,
        initiative: 0,
        isDead: false,
        id: uuidv4(),
        isCharacter: true,
      }),
    );
    const newParticipantsGroup: IParticipantGroup = {
      [ParticipantsGroupFields.GroupName]: group[GroupFields.GroupName], // Der Gruppenname aus dem `group` Objekt
      [ParticipantsGroupFields.Participants]: player,
      [ParticipantsGroupFields.Player]: player,
    };
    setParticipantsGroup(newParticipantsGroup);
    setGameStats({ round: 1, turn: 1 });
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

  const setShowDead = (bool: boolean) => {
    setLayoutOptions({ ...layoutOptions, showDead: bool });
  };

  const setIsEdit = (bool: boolean) => {
    setLayoutOptions({ ...layoutOptions, isEdit: bool });
  };

  const setHideMenu = (bool: boolean) => {
    setLayoutOptions({ ...layoutOptions, hideMenu: bool });
  };

  const setTurn = (turn: number) => {
    setGameStats({ ...gameStats, turn });
  };

  const setRound = (round: number) => {
    setGameStats({ ...gameStats, round });
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
      [ParticipantsGroupFields.Player]:
        participantsGroup[ParticipantsGroupFields.Player],
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
          {t("Round")}: {gameStats.round}
        </Typography.Title>
        <Flex gap={"middle"}>
          <section style={{ flexBasis: 450 }}>
            <Card style={{ minHeight: 400 }}>
              <Flex
                style={{ minHeight: 350 }}
                vertical
                justify={"space-between"}
                gap={"middle"}
              >
                <ParticipantTable
                  handleIsDead={handleIsDead}
                  onIniChange={handleIniChange}
                  participants={participantsGroup.participants}
                  setRound={setRound}
                  round={gameStats.round}
                  turn={gameStats.turn}
                  setTurn={setTurn}
                  showDead={layoutOptions.showDead}
                  isEdit={layoutOptions.isEdit}
                  onRemoveParticipant={handleDeleteParticipant}
                />
                <Button
                  style={{ marginTop: "auto" }}
                  onClick={() => setHideMenu(!layoutOptions.hideMenu)}
                >
                  Toggle Menu
                </Button>
              </Flex>
            </Card>
          </section>
          {!layoutOptions.hideMenu && (
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
                  <Flex justify={"space-between"}>
                    <Flex vertical gap={"middle"}>
                      <Button
                        onClick={() => setShowDead(!layoutOptions.showDead)}
                      >
                        {layoutOptions.showDead ? t("HideDead") : t("ShowDead")}
                      </Button>
                      <Button
                        type={layoutOptions.isEdit ? "primary" : "default"}
                        onClick={() => setIsEdit(!layoutOptions.isEdit)}
                      >
                        {t("EditParticipants")}
                      </Button>
                    </Flex>
                    <Flex vertical gap={"middle"}>
                      {participantsGroup[ParticipantsGroupFields.Player]?.map(
                        (participant, index) => (
                          <Flex
                            key={participant.name}
                            justify={"end"}
                            gap={"middle"}
                            align={"center"}
                          >
                            <Typography.Text>
                              {participant.name}
                            </Typography.Text>
                            <Form.Item
                              key={index}
                              style={{ margin: 0, width: 80 }}
                            >
                              <InputNumber
                                controls={false}
                                value={
                                  participantsGroup[
                                    ParticipantsGroupFields.Participants
                                  ].find((p) => p.id === participant.id)
                                    ?.initiative || 0
                                }
                                onChange={(value) =>
                                  handleIniChange(
                                    value as number | null,
                                    participant.id,
                                  )
                                }
                              />
                            </Form.Item>
                          </Flex>
                        ),
                      )}
                    </Flex>
                  </Flex>
                </Form>
              </Card>
            </aside>
          )}
        </Flex>
      </Flex>
    </main>
  );
};
