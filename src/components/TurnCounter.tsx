import { useActiveSessionStore } from "@/hooks/useActiveSessionStore";
import { Typography } from "antd";

export const TurnCounter = () => {
  const turn = useActiveSessionStore(state => state.turn);
  return (
      <Typography.Text>Turn: {turn}</Typography.Text>
  );
}
