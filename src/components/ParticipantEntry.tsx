import { Participant } from "@/types/Participant";
import { CSSProperties, FC } from "react";
import { Button, Card, Flex, Form, Input, Typography } from "antd";
import { SaveOutlined, DeleteOutlined } from "@ant-design/icons";
import { useActiveSessionStore } from "@/hooks/useActiveSessionStore";

type ParticipantEntryProps = {
  participant: Participant;
  isActive: boolean;
  isEdit?: boolean;
}
export const ParticipantEntry: FC<ParticipantEntryProps> = ({ participant, isActive, isEdit = false}) => {
const {Text} = Typography;
const {updateParticipantDefeated, updateParticipant, removeParticipant} = useActiveSessionStore();
const style = {
  background: isActive ? 'var(--ant-color-warning-bg)' : '',
  opacity: participant.isDefeated ? 0.5 : 1,
};

const handleFinish = (values: Participant) => {
  const updatedParticipant = {...participant, ...values}
  updateParticipant(updatedParticipant)
}

if(isEdit) {
  return (
    <li>
      <Card style={{...style, '--ant-padding-lg': '7px'} as CSSProperties}>
        <Form onFinish={handleFinish} initialValues={{name: participant.name, ini: participant.ini}}>
          <Flex gap={'middle'} justify={"space-between"}>
            {!participant.isCharacter && <Button danger onClick={() => removeParticipant(participant.id)} icon={<DeleteOutlined/>}/>}
            <Form.Item name={'name'} style={{marginBottom: 0}}>
              <Input disabled={participant.isCharacter}/>
            </Form.Item>
            <Form.Item name={'ini'} style={{marginBottom: 0, width: '100px'}}>
              <Input disabled={participant.isCharacter}/>
            </Form.Item>
            <Button htmlType={'submit'} disabled={participant.isCharacter} icon={<SaveOutlined/>}/>
          </Flex>
        </Form>
      </Card>
    </li>
  )
}

  return (
    <li>
      <Card size={'small'} onClick={() => updateParticipantDefeated(participant.id, !participant.isDefeated)} style={style}>
      <Flex gap={'middle'} justify={"space-between"}>
        <Text>{participant.name}</Text>
        <Text>{participant.ini}</Text>
      </Flex>
      </Card>
    </li>
  )
}
