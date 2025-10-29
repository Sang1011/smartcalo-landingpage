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
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";

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
    key: "/admin/exercises",
    icon: <DesktopOutlined />,
    label: "Quản lý Bài tập",
    path: "/admin/exercises",
  },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { logout } = useAuth();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="dark"
        style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}
      >
        {/* Phần trên: logo + menu */}
        <div>
          <div className="text-white text-2xl font-bold text-center py-4">
            {collapsed ? "SC" : "SmartCalo"}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems.map((item) => ({
              key: item.key,
              icon: item.icon,
              label: <Link to={item.path}>{item.label}</Link>,
            }))}
          />
        </div>

        {/* Phần dưới: nút logout */}
        <div className="p-4 border-t border-gray-700">
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            block
            onClick={logout}
          >
            {!collapsed && "Đăng xuất"}
          </Button>
        </div>
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
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
