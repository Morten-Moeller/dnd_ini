import type { PropsWithChildren } from 'react'
import {AntdStyleProvider} from '@/components/AntdStyleProvider'
import '@/app/global.css'
import { Layout } from "antd";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="es">
       <body>
    <AntdStyleProvider>
      <Layout style={{ height: '100%', alignItems: 'center'}}>{children}</Layout>
    </AntdStyleProvider>
       </body>
    </html>
  )
};
