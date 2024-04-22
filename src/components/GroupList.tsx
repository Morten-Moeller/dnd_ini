import { useGroupStore } from "@/hooks/useGroupStore";
import { FC } from "react";
import { Button } from "antd";

export const GroupList: FC = () => {
  const { groups, removeGroup } = useGroupStore();

  return (
    <div>
      <h1>GroupList</h1>
      <ul>
        {groups.map((group) => {
          return (
            <li key={group.id}>
              <p>{group.name}</p>
              <Button onClick={() => removeGroup(group.id)}>Remove</Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
