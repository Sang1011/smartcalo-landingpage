import { useState, useEffect } from "react";
import { Table, Input, Button, Space, Modal, Tag, Alert } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getUsersThunk, deleteUserThunk } from "../../features/users/userSlice";
import type { UserSummary } from "../../features/users/userSlice";

const { Search } = Input;

const getCustomerTypeColor = (type: string) => {
  if (type === "Premium") return "gold";
  return "default";
};
const renderGender = (gender: number | null) => {
  if (gender === 0) return "Nam";
  if (gender === 1) return "Nữ";
  return "N/A";
};

export default function UserManagement() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.user);

  const [modal, contextHolder] = Modal.useModal();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    dispatch(
      getUsersThunk({
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
        searchTerm: searchTerm,
      })
    );
  }, [dispatch, pagination.current, pagination.pageSize, searchTerm]);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      total: data?.count || 0,
      current: data?.pageIndex || 1,
      pageSize: data?.pageSize || 10,
    }));
  }, [data]);

  const showDeleteConfirm = (id: string, name: string) => {
    modal.confirm({
      title: `Bạn có chắc muốn xóa vĩnh viễn người dùng ${name}?`,
      content: "Người dùng này sẽ bị hủy toàn bộ dữ liệu trong hệ thống.",
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        dispatch(deleteUserThunk(id));
      },
    });
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const columns: ColumnsType<UserSummary> = [
    {
      title: "Tên người dùng",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender: number | null) => renderGender(gender),
    },
    {
      title: "Tuổi",
      dataIndex: "age",
      key: "age",
      render: (age: number | null) => age || "N/A",
    },
    {
      title: "Loại tài khoản",
      dataIndex: "customerType",
      key: "customerType",
      render: (type: string) => (
        <Tag color={getCustomerTypeColor(type)}>{type}</Tag>
      ),
    },
    {
      title: "Hạn Premium",
      dataIndex: "currentSubscriptionExpiresAt",
      key: "currentSubscriptionExpiresAt",
      render: (date: string | null) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      title: "Xóa",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.id, record.name)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      {contextHolder}

      <Search
        placeholder="Tìm kiếm theo tên hoặc email..."
        onSearch={handleSearch}
        style={{ marginBottom: 16 }}
        enterButton
      />

      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Table
        columns={columns}
        dataSource={data?.data}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
}
