import { ParticipantEntry } from "./ParticipantEntry";
import { FC, useState } from "react";
import { useActiveSessionStore } from "@/hooks/useActiveSessionStore";
import { Button, Flex, Typography } from "antd";
import { TurnCounter } from "./TurnCounter";

export const ParticipantsList: FC = () => {
  const { participants, nextActiveParticipant, previousActiveParticipant, activeParticipant, name} = useActiveSessionStore(state => state);
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div style={{ maxHeight: '100%'}}>
      <Flex justify={'space-between'} align={"baseline"}>
      <Typography.Title level={2}>Participants</Typography.Title>
        <Typography.Text>Session: {name}</Typography.Text>
      <TurnCounter />
      </Flex>
    <ol style={{maxHeight: '80%', overflowY: "auto"}}>
      {participants.map((participant) => (<ParticipantEntry key={participant.id} participant={participant} isEdit={isEditing} isActive={activeParticipant === participant.id}/>))}
    </ol>
      <Flex gap={'small'} style={{ marginTop: 'var(--ant-margin-xl'}}>
      <Button onClick={() => setIsEditing(!isEditing)} style={{ marginRight: 'auto'}}>Edit</Button>
      <Button onClick={previousActiveParticipant}>Previous</Button>
      <Button onClick={nextActiveParticipant}>{!activeParticipant ? 'Start': 'Next'}</Button>
      </Flex>
    </div>
  )
}
