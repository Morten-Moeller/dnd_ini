import { Dispatch, FC, SetStateAction } from "react";
import { Button, Divider, Form, Input, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";
import { GroupFields } from "./types/GroupFields.ts";
import { IGroup } from "./types/IGroup.ts";

interface INewGroupFormProps {
  open: boolean;
  setOpen:  Dispatch<SetStateAction<boolean>>;
  onAddGroup: (values: IGroup) => void;
}

export const NewGroupForm: FC<INewGroupFormProps> = ({ open, setOpen, onAddGroup }) => {
  const { t } = useTranslation();

  if(!open) return null;

  const onFinish = (values: IGroup) => {
    onAddGroup(values);
    setOpen(false);
  }

  return (
    <Form
      name="dynamic_form_nest_item"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      autoComplete="off"
      initialValues={{[GroupFields.Characters]: [{name: ''}, {name: ''}, {name: ''}]}}
    >
      <Form.Item
        label={t('GroupNameLabel')}
        name={GroupFields.GroupName}
        rules={[{ required: true, message: t('validation.MissingName') }]}
      >
        <Input />
      </Form.Item>
      <Divider />
      <Form.List name={GroupFields.Characters}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  label={t('NameLabel')}
                  name={[name, 'name']}
                  rules={[{ required: true, message: t('validation.MissingName') }]}
                >
                  <Input />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {t('AddGroup')}
        </Button>
      </Form.Item>
    </Form>
  )
}
