import { Button, Flex, Typography } from "antd";
import { FC } from "react";
import Link from "next/link";
import { useSessionStore } from "@/hooks/useSessionStore";
import { Routes } from "@/routing/Routes";

type SessionListProps = {
  groupId: string;
};

export const SessionList: FC<SessionListProps> = ({groupId}) => {
  const { sessions, removeSession } = useSessionStore();

  return (
    <div>
      <Typography.Title level={2}>SessionList</Typography.Title>
      <ul>
        {sessions.filter(s => s.groupId === groupId).map((session) => {
          return (
            <li key={session.id} style={{marginBottom: 'var(--ant-margin)'}}>
              <Flex justify={"space-between"} align={'center'}>
              <Button onClick={() => removeSession(session.id)}>Remove</Button>
              <p>{session.name}</p>
              <Link href={Routes.Session(session.id)}><Button type={'primary'}>Resume</Button></Link>
              </Flex>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
