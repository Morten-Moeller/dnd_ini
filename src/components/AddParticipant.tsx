import { Typography, Form, Input, Flex, Button } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useActiveSessionStore } from "@/hooks/useActiveSessionStore";
import { Participant } from "@/types/Participant";
import { useCallback } from "react";

export const AddParticipant = () => {
  const [form] = Form.useForm<Participant>()
  const { Title } = Typography
  const {addParticipant} = useActiveSessionStore()
  const handleFinish =useCallback((values: Participant) => {
    addParticipant(values)
    const id = uuidv4()
    form.setFieldsValue({id})
  }, [addParticipant, form])

  const hasName = Form.useWatch( 'name', form)

  return (
    <Flex vertical >
      <Title level={2}>Add Participant</Title>
      <Form form={form} layout={'vertical'} onFinish={handleFinish}>
        <Flex gap={'small'}>
          <Form.Item name="id" initialValue={uuidv4()} hidden>
            <Input />
          </Form.Item>
          <Form.Item name={'name'} style={{ width: '70%'}} rules={[{ required: true, message: 'Please enter participant name' }]} required>
            <Input placeholder={"Name"} />
          </Form.Item>
          <Form.Item name={"ini"} style={{ width: '30%'}}>
            <Input placeholder={"ini"} />
          </Form.Item>
        </Flex>
      </Form>
        <Button type={'primary'} style={{alignSelf: 'flex-end'}} onClick={() => form.submit()}
                disabled={!hasName}
        >Add</Button>
    </Flex>
  )
}
