import {
  Button,
  Card,
  Flex,
  List,
  Modal,
  Popover,
  Select,
  Typography,
} from "antd";
import { FC, useEffect, useMemo, useState } from "react";
import { IGroup } from "../types/IGroup.ts";
import { useTranslation } from "react-i18next";
import { Languages } from "../types/Languages.ts";
import { NewGroupForm } from "../NewGroupForm.tsx";
import { GroupFields } from "../types/GroupFields.ts";
import { useNavigate } from "react-router-dom";
import { fromLocalStorage, toLocalStorage } from "../utils/localStorage.ts";
import { LocalStorageKeys } from "../types/LocalStorageKeys.ts";

export const LandingPage: FC = () => {
  const { Title, Text } = Typography;
  const [openGroup, setOpenGroup] = useState(false);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [showKnownIssues, setShowKnownIssues] = useState(false);
  const navigate = useNavigate();

  const knownIssues = [
    "if you toggle hide dead, the active player isn't selected anymore",
    "if first player is dead, the round count didn't work",
    "and many more...",
  ];

  useEffect(() => {
    const groups = fromLocalStorage(LocalStorageKeys.Groups);
    if (groups) setGroups(groups);
  }, []);

  useEffect(() => {
    if (groups.length === 0) return;
    toLocalStorage(LocalStorageKeys.Groups, groups);
  }, [groups]);

  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(language);

  const handleChangeLanguage = (value: Languages) => {
    setCurrentLanguage(value);
    changeLanguage(value);
  };

  const handleAddGroup = (values: IGroup) => {
    setGroups([...groups, values]);
  };

  const handleGroupSelection = (group: IGroup) => {
    toLocalStorage(LocalStorageKeys.Group, group);
    navigate("/play");
  };

  return (
    <main style={{ minHeight: 400, maxWidth: 900, width: "100%" }}>
      <Flex vertical gap={"large"}>
        <Flex justify={"space-between"}>
          <Title level={2} style={{ margin: 0 }}>
            {t("Title")}
          </Title>
          <Select
            style={{ width: "max-content" }}
            defaultValue={currentLanguage as Languages}
            onChange={handleChangeLanguage}
            options={[
              { value: Languages.German, label: "DE" },
              { value: Languages.English, label: "EN" },
            ]}
          />
        </Flex>
        <Flex gap={"middle"}>
          <section style={{ flex: 2 }}>
            <Card style={{ minHeight: 400 }}>
              <Flex gap={"large"} vertical align={"start"}>
                <Button
                  onClick={() => setOpenGroup(true)}
                  disabled={openGroup}
                  type={"primary"}
                >
                  {t("NewGroup")}
                </Button>
                <NewGroupForm
                  open={openGroup}
                  setOpen={setOpenGroup}
                  onAddGroup={handleAddGroup}
                />
              </Flex>
            </Card>
          </section>
          <aside style={{ flex: 1 }}>
            <Card style={{ minHeight: 400 }}>
              <Flex vertical gap={"middle"}>
                {groups.length === 0
                  ? t("NoGroupFound")
                  : groups.map((group) => (
                      <Button
                        key={group[GroupFields.GroupName]}
                        onClick={() => handleGroupSelection(group)}
                      >
                        {group[GroupFields.GroupName]}
                      </Button>
                    ))}
              </Flex>
            </Card>
          </aside>
        </Flex>
      </Flex>
      <Flex justify={"space-around"} align={"center"} style={{ marginTop: 24 }}>
        <Text type={"secondary"}>v0.0.1</Text>
        <Popover
          content={
            <List
              dataSource={knownIssues}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          }
          trigger={"click"}
          open={showKnownIssues}
          onOpenChange={(newOpen) => setShowKnownIssues(newOpen)}
        >
          <Button type={"text"}>
            <Text type={"secondary"}>{t("KnownIssues")}</Text>
          </Button>
        </Popover>
      </Flex>
    </main>
  );
};
