'use client'
import { useEffect } from "react";
import { useActiveSessionStore } from "@/hooks/useActiveSessionStore";
import { Tabs } from "antd";
import { ParticipantsTab } from "@/components/ParticipantsTab";
import { SessionSettingsTab } from "@/components/SessionSettingsTab";
import { useRouter } from 'next/router'

export default function Page ({params}: {params: { sessionId: string }}) {
  const {loadSession} = useActiveSessionStore(state => state);
  const sessionId = params.sessionId;

  useEffect(() => {
    if (!sessionId) return
    loadSession(sessionId);
  }, [loadSession, sessionId]);

  const items = [
    { label: 'Participants', key: '1', children: <ParticipantsTab />},
    { label: 'Settings', key: '2', children: <SessionSettingsTab />},
  ];

  return (
    <div style={{ height: '100%', width: '424px', padding: 'var(--ant-padding)'}}>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  )
}

