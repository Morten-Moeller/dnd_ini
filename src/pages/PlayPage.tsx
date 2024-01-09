import { FC, useEffect, useState } from "react";
import { Button, Card, Divider, Flex, Form, Input, Spin, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { GroupFields } from "../types/GroupFields.ts";
import { IGroup } from "../types/IGroup.ts";
import { LocalStorageKeys } from "../types/LocalStorageKeys.ts";
import { fromLocalStorage } from "../utils/localStorage.ts";
import { useNavigate } from "react-router-dom";

export const PlayPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [group, setGroup] = useState<IGroup | null>(null);
  const [roundCounter, setRoundCounter] = useState(1);

  useEffect(() => {
    const group = fromLocalStorage(LocalStorageKeys.Group);
    if(group) setGroup(group);
  },[])

  if(!group) return <Spin />

  return (
    <main style={{ minHeight: 400, maxWidth: 1100, width: "100%" }}>
      <Flex vertical>
          <Flex justify={'space-between'}>
            <Button onClick={() => navigate('/')}>{t('Back')}</Button>
              <Typography.Title  style={{ margin: 0 }} level={2}>{group[GroupFields.GroupName]}</Typography.Title>
            <Button>{t('Clear')}</Button>
          </Flex>
        <Typography.Title level={4} style={{textAlign: 'center', margin: '8px 0 24px 0'}}>{t('Round')}: {roundCounter}</Typography.Title>
        <Flex gap={"middle"}>
          <section style={{ flex: 2 }}>
            <Card style={{ minHeight: 400 }}>

            </Card>
          </section>
          <aside style={{ flex: 1 }}>
            <Card style={{ minHeight: 400 }}>
              <Form layout={'vertical'}>
                <Flex gap={'small'} style={{marginBottom: 12}}>
                <Form.Item label={t('Name')} style={{ flex: 3, margin: 0}}>
                  <Input />
                </Form.Item>
                <Form.Item label={t('Init')} style={{ flex: 1, margin: 0}}>
                  <Input />
                </Form.Item>
                </Flex>
                <Button style={{width: '100%'}}>{t('Add')}</Button>
              </Form>
              <Divider />
                <Form layout={'vertical'}>
                  <Flex vertical gap={'middle'}>
              {
                group[GroupFields.Characters].map((character, index) => (
                  <Flex justify={"end"} gap={'middle'} align={"center"} >
                    <Typography.Text>{character.name}</Typography.Text>
                 <Form.Item key={index} style={{margin: 0, width: 60}}>
                   <Input />
                  </Form.Item>
                  </Flex>
                ))
                  }
                  </Flex>
                </Form>

            </Card>
          </aside>
        </Flex>
      </Flex>

    </main>
  )

}
