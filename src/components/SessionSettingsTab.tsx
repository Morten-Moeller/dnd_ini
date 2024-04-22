import { CharacterEditor } from "./CharacterEditor";
import { AddParticipant } from "./AddParticipant";
import { Button, Flex } from "antd";
import { useActiveSessionStore } from "@/hooks/useActiveSessionStore";
import { Routes } from "@/routing/Routes";
import Link from "next/link";

export const SessionSettingsTab = () => {
  const resetSession = useActiveSessionStore(state => state.resetSession);
  return (
    <Flex vertical gap={'large'} style={{ maxWidth: '424px'}}>
      <Link href={Routes.Home}>&lt;– Back to start page</Link>
      <AddParticipant />
      <CharacterEditor />
      <Button onClick={resetSession}>Reset Session</Button>
    </Flex>
  )
}
