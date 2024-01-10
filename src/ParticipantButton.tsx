import { IParticipant } from "./types/IParticipant.ts";
import { FC, useState } from "react";
import { Button, Divider, Flex, Typography } from "antd";

interface IParticipantButtonProps {
  participant: IParticipant;
 index: number;
 turn : number;
}

export const ParticipantButton: FC<IParticipantButtonProps> = ({ participant, index, turn }) => {
  const [isDead, setIsDead] = useState(false);
  const {Text} = Typography;
  return ( <Button type={turn === index ? 'primary': 'default'} onClick={()=> setIsDead(!isDead)}>
    <Flex gap={'small'} justify={'space-between'} align={'center'}>
      <Text>{index + 1})</Text>
      <Text>{participant.name}</Text>
      <div>
      <Divider type={"vertical"} />
      <Text>{participant.initiative}</Text>
      </div>
    </Flex>
  </Button>)
}
