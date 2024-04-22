import { useActiveSessionStore } from "../hooks/useActiveSessionStore.ts";
import { Typography } from "antd";

export const TurnCounter = () => {
  const turn = useActiveSessionStore(state => state.turn);
  return (
      <Typography.Text>Turn: {turn}</Typography.Text>
  );
}
