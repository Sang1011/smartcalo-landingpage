import { useState } from "react";
import { Layout, Menu, Button, theme } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  DesktopOutlined,
  FileTextOutlined,
  UserOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: "/admin",
    icon: <BarChartOutlined />,
    label: "Thống kê",
    path: "/admin",
  },
  {
    key: "/admin/users",
    icon: <UserOutlined />,
    label: "Quản lý Người dùng",
    path: "/admin/users",
  },
  {
    key: "/admin/recipes",
    icon: <FileTextOutlined />,
    label: "Quản lý Thực đơn",
    path: "/admin/recipes",
  },
  {
    key: "/admin/workouts",
    icon: <DesktopOutlined />,
    label: "Quản lý Bài tập",
    path: "/admin/workouts",
  },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
        <div className="demo-logo-vertical text-white text-2xl font-bold text-center py-4">
          {collapsed ? "SC" : "SmartCalo"}
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.path}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: "auto",
          }}
        >
          <Outlet /> {/* Đây là nơi nội dung của các trang con sẽ hiển thị */}
        </Content>
      </Layout>
    </Layout>
  );
}
