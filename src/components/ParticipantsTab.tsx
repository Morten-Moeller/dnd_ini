import { ParticipantsList } from "./ParticipantsList";
import { Flex} from "antd";

export const ParticipantsTab = () => {
  return (
    <Flex vertical gap={'large'} style={{ maxWidth: '424px'}}>
    <ParticipantsList />
    </Flex>
  )
}
