import { FC, Fragment } from "react";
import { Button, Divider, Flex, Form, Input, Modal } from "antd";
import { Group } from "@/types/Group";
import { v4 as uuidv4 } from 'uuid';

type NewGroupModalProps = {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  onFinish: (values: Group) => void;
};

export const NewGroupModal: FC<NewGroupModalProps> = ({ open, onOk, onCancel, onFinish }) => {
  const [form] = Form.useForm<Group>();
  const handleOk = () => {
    form.submit();
    onOk();
  }

  return (
    <Modal title="New Group" open={open} onOk={handleOk} onCancel={onCancel}>
      <Form layout={'vertical'} form={form} onFinish={onFinish}>
        <Form.Item name="id" initialValue={uuidv4()} hidden>
          <Input />
        </Form.Item>
        <Form.Item label="Group name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.List name="characters">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Fragment key={key}>
               <Flex align={'flex-end'} gap={'large'}>
                  <Form.Item
                    {...restField}
                    name={[name, 'id']}
                    initialValue={uuidv4()} // Setzt die ID für jeden Charakter
                    hidden
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Character name"
                    name={[name, 'name']}
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Dex"
                    name={[name, 'dex']}
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                 <Form.Item>
                  <Button danger onClick={() => remove(name)}>Remove</Button>
                 </Form.Item>
               </Flex>
                <Divider style={{ margin: '0 0 var(--ant-padding-xs) 0'}} />
                </Fragment>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Add Character
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};
