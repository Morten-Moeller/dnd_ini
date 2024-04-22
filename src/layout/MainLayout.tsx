import {Layout} from "antd";
import {Outlet} from "react-router-dom";
import styles from './MainLayout.module.css';

export const MainLayout = () => {
  const { Content } = Layout;
  return (
    <Layout className={styles.wrapper}>
      {/*<Header className={styles.header}>*/}
      {/*  <h1>DnD Initiative Manager</h1>*/}
      {/*</Header>*/}
      <Layout>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
