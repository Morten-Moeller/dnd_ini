'use client'
import { Button, Card, Flex, Input, Select, Typography } from "antd";
import { useState } from "react";
import { useGroupStore } from "@/hooks/useGroupStore";
import { useSessionStore } from "@/hooks/useSessionStore";
import { useRouter } from "next/navigation";
import { Group } from "@/types/Group";
import { Routes } from "@/routing/Routes";
import { NewGroupModal } from "@/components/NewGroupModal";
import { SessionList } from "@/components/SessionList";


const StartPage = () => {
  const [open, setOpen] = useState(false)
  const addGroup = useGroupStore(state => state.addGroup)
  const groups = useGroupStore(state => state.groups)
  const newSession = useSessionStore(state => state.newSession)
  const options = groups.map(group => ({label: group.name, value: group.id}))
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(undefined)
  const [sessionName, setSessionName] = useState('')
  const router = useRouter()

  const handleFinish = (values: Group) => {
    addGroup(values)
    setSelectedGroupId(values.id)
  }

  const { Paragraph, Title } = Typography

  const handleStart = () => {
    if (!selectedGroupId) return
    const sessionId = newSession(selectedGroupId, sessionName)
    router.push(Routes.Session(sessionId))
  }

  return (
    <Flex vertical style={{ padding: 'var(--ant-padding)'}} gap={'middle'}>
    <Card style={{maxWidth: 'max-content'}}>
      <Title level={2}>Welcome to the DnD Initiative Manager</Title>
      <Paragraph>
        This is a simple application to help you manage initiative order in your DnD games.
      </Paragraph>
      <Paragraph>
        To get started, click on the &quot;New Group&quot; button in the sidebar.
      </Paragraph>
    </Card>
      <Flex gap={'large'}>
        <Button type={'primary'} onClick={() => setOpen(!open)}>New Group</Button>
        {groups.length > 0 && (
            <Flex gap={'large'} style={{ marginLeft: 'auto'}}>
              <Select placeholder={'Wähle eine Gruppe'} onChange={setSelectedGroupId} value={selectedGroupId} options={options}/>

            </Flex>
          )}
      </Flex>
      <NewGroupModal open={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)} onFinish={handleFinish} />
      {selectedGroupId && (
        <>
          <SessionList groupId={selectedGroupId}/>
          <Flex gap={'large'}>
            <Input placeholder={'Session name'} value={sessionName} onChange={(e) => setSessionName(e.target.value)} /><Button disabled={!selectedGroupId || !sessionName} type={'primary'} onClick={handleStart}>Start new</Button>
          </Flex>
        </>)}
    </Flex>
  )
}

export default StartPage
