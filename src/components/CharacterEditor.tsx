import { FC } from "react";
import { useActiveSessionStore } from "@/hooks/useActiveSessionStore";
import { useGroupStore } from "@/hooks/useGroupStore";
import { Flex, InputNumber, Typography, Form } from "antd";

export const CharacterEditor: FC = () => {
  const { groupId , participants, updateParticipantInitiative} = useActiveSessionStore(state => state);
  const group = useGroupStore(state => state.getGroup(groupId));
  const { Title } = Typography
  return (
    <div>
      <Title level={2}>Character Editor</Title>
      {
        group?.characters.map((character) => {
          const participant = participants?.find(p => p.id === character.id);
          if (!participant) return
          return (
            <Flex gap={'large'} key={character.id} align={'center'} justify={'space-between'} style={{ margin: 'var(--ant-margin-sm'}} >
              <Title level={3} style={{ margin: 0}}>{character.name}</Title>
              <Form.Item label={"ini"} style={{ margin: 0}}>
                <InputNumber
                  controls={false}
                  value={participant.ini}
                  onChange={(value) => updateParticipantInitiative(participant.id, value || 0)} />
              </Form.Item>
            </Flex>
          )
        })
      }
    </div>
  )
}
