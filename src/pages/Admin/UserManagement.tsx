import { useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Modal,
  Form,
  Select,
  Tag,
  DatePicker,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const { Search } = Input;
const { Option } = Select;

// Định nghĩa kiểu dữ liệu cho một người dùng
interface UserDataType {
  key: string;
  id: string;
  name: string;
  email: string;
  subscription: "free" | "monthly" | "yearly";
  status: "active" | "blocked";
  joinDate: string;
}

// Dữ liệu giả lập
const initialUsers: UserDataType[] = [
  {
    key: "1",
    id: "USR001",
    name: "Mạch Gia Hào",
    email: "haomgse182489@fpt.edu.vn",
    subscription: "yearly",
    status: "active",
    joinDate: "2025-10-04",
  },
  {
    key: "2",
    id: "USR002",
    name: "Lương Hồng Mỹ",
    email: "mylhse184354@fpt.edu.vn",
    subscription: "monthly",
    status: "active",
    joinDate: "2025-10-04",
  },
  {
    key: "3",
    id: "USR003",
    name: "Nguyễn Hoàng Tuệ Sang",
    email: "sangnhtse186544@fpt.edu.vn",
    subscription: "free",
    status: "blocked",
    joinDate: "2025-10-04",
  },
  {
    key: "4",
    id: "USR004",
    name: "Trần Trọng Tấn",
    email: "tanttse184687@fpt.edu.vn",
    subscription: "yearly",
    status: "active",
    joinDate: "2025-10-04",
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState<UserDataType[]>(initialUsers);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDataType | null>(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({ joinDate: dayjs() }); // Gán ngày hiện tại khi thêm mới
    setIsModalVisible(true);
  };

  const handleEdit = (record: UserDataType) => {
    setEditingUser(record);
    // Chuyển đổi chuỗi ngày tháng sang đối tượng dayjs cho DatePicker
    form.setFieldsValue({
      ...record,
      joinDate: dayjs(record.joinDate, "YYYY-MM-DD"),
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
  };

  const onFinish = (values: any) => {
    // Chuyển đổi đối tượng dayjs về chuỗi 'YYYY-MM-DD' trước khi lưu
    const formattedValues = {
      ...values,
      joinDate: values.joinDate.format("YYYY-MM-DD"),
    };

    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.key === editingUser.key ? { ...editingUser, ...formattedValues } : u
        )
      );
    } else {
      const newUser: UserDataType = {
        ...formattedValues,
        key: (users.length + 1).toString(),
        id: `USR${(users.length + 1).toString().padStart(3, "0")}`,
      };
      setUsers([...users, newUser]);
    }
    setIsModalVisible(false);
  };

  const handleSearch = (value: string) => {
    setSearchText(value.toLowerCase());
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText)
  );

  const columns: ColumnsType<UserDataType> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    { title: "Tên người dùng", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Ngày tham gia",
      dataIndex: "joinDate",
      key: "joinDate",
      sorter: (a, b) =>
        new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime(),
    },
    {
      title: "Gói dịch vụ",
      dataIndex: "subscription",
      key: "subscription",
      render: (sub: string) => {
        let color = "geekblue";
        let text = "Năm";
        if (sub === "monthly") {
          color = "green";
          text = "Tháng";
        }
        if (sub === "free") {
          color = "volcano";
          text = "Miễn phí";
        }
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: "Miễn phí", value: "free" },
        { text: "Tháng", value: "monthly" },
        { text: "Năm", value: "yearly" },
      ],
      onFilter: (value, record) => record.subscription === value,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "success" : "error"}>
          {status === "active" ? "Hoạt động" : "Bị khóa"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button type="primary" danger icon={<DeleteOutlined />}>
            Khóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Search
          placeholder="Tìm kiếm theo tên hoặc email..."
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm người dùng mới
        </Button>
      </div>
      <Table columns={columns} dataSource={filteredUsers} rowKey="key" />

      <Modal
        title={
          editingUser ? "Chỉnh sửa thông tin người dùng" : "Thêm người dùng mới"
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ joinDate: dayjs() }}
        >
          <Form.Item
            name="name"
            label="Tên người dùng"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          {/* THÊM TRƯỜNG NGÀY THAM GIA */}
          <Form.Item
            name="joinDate"
            label="Ngày tham gia"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="subscription"
            label="Gói dịch vụ"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="free">Miễn phí</Option>
              <Option value="monthly">Tháng</Option>
              <Option value="yearly">Năm</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="active">Hoạt động</Option>
              <Option value="blocked">Bị khóa</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
