import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Modal,
  Form,
  Upload,
  Avatar,
  Typography,
  InputNumber,
  Row,
  Col,
  Alert,
  Descriptions,
  Tabs,
} from "antd";
import type { TabsProps } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import {
  getDishesThunk,
  deleteDishThunk,
  createDishThunk,
  updateDishThunk,
  clearDishError,
} from "../../features/dishes/dishSlice";
import type { Dish } from "../../features/dishes/dishSlice";

import {
  getMenusThunk,
  createMenuThunk,
  clearMenuError,
} from "../../features/menus/menuSlice";
import type { MenuSummary } from "../../features/menus/menuSlice";

const { Search } = Input;
const { Title } = Typography;

const DishManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(
    (state) =>
      state.dish || {
        data: null,
        loading: false,
        error: null,
      }
  );
  const [modal, contextHolder] = Modal.useModal();

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [nutritionModal, setNutritionModal] = useState<Dish | null>(null);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 5,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
  });

  useEffect(() => {
    dispatch(
      getDishesThunk({
        pageIndex: (pagination.current || 1) - 1,
        pageSize: pagination.pageSize,
      })
    );
  }, [dispatch, pagination.current, pagination.pageSize]);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      total: data?.count || 0,
      current: (data?.pageIndex || 0) + 1,
      pageSize: data?.pageSize || 5,
    }));
  }, [data]);

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  const handleAdd = () => {
    setEditingDish(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Dish) => {
    setEditingDish(record);
    form.setFieldsValue({
      ...record,
      ImageUrl: record.imageUrl
        ? [
            {
              uid: "-1",
              name: "Ảnh hiện tại",
              status: "done",
              url: record.imageUrl,
            },
          ]
        : [],
    });
    setIsModalVisible(true);
  };

  const showDeleteConfirm = (record: Dish) => {
    modal.confirm({
      title: `Bạn có chắc muốn xóa món "${record.name}"?`,
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        dispatch(deleteDishThunk(record.id));
      },
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingDish(null);
  };

  const onFinish = async (values: any) => {
    const formData = new FormData();
    if (
      values.ImageUrl &&
      values.ImageUrl[0] &&
      values.ImageUrl[0].originFileObj
    ) {
      formData.append("ImageUrl", values.ImageUrl[0].originFileObj);
    }
    formData.append("Name", values.name);
    formData.append("Category", values.category);
    formData.append("Description", values.description);
    formData.append("Instructions", values.instructions);
    formData.append("Ingredients", values.ingredients);
    formData.append("CookingTime", values.cookingTime);
    formData.append("Servings", values.servings);
    formData.append("Calories", values.calories);
    formData.append("Protein", values.protein);
    formData.append("Carbs", values.carbs);
    formData.append("Fat", values.fat);
    formData.append("Fiber", values.fiber);
    formData.append("Sugar", values.sugar);

    try {
      if (editingDish) {
        await dispatch(
          updateDishThunk({ id: editingDish.id, formData })
        ).unwrap();
      } else {
        await dispatch(createDishThunk(formData)).unwrap();
      }
      setIsModalVisible(false);
      dispatch(
        getDishesThunk({
          pageIndex: (pagination.current || 1) - 1,
          pageSize: pagination.pageSize,
        })
      );
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };

  const columns: ColumnsType<Dish> = [
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 80,
      render: (url, record) => (
        <Avatar shape="square" size={64} src={url} alt={record.name}>
          {record.name.charAt(0)}
        </Avatar>
      ),
    },
    { title: "Tên món ăn", dataIndex: "name", key: "name" },
    { title: "Phân loại", dataIndex: "category", key: "category" },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 250,
    },
    {
      title: "Thời gian nấu (phút)",
      dataIndex: "cookingTime",
      key: "cookingTime",
      align: "center",
      width: 100,
    },
    {
      title: "Dinh dưỡng",
      key: "nutrition",
      align: "center",
      width: 100,
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => setNutritionModal(record)}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <div className="flex justify-between items-center mb-4">
        <Title level={4}>Danh sách Món ăn</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm món ăn
        </Button>
      </div>
      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => dispatch(clearDishError())}
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

      <Modal
        title={editingDish ? "Chỉnh sửa món ăn" : "Thêm món ăn mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên món ăn"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Phân loại"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="instructions" label="Hướng dẫn">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="ingredients"
            label="Nguyên liệu (cách nhau bởi dấu phẩy)"
          >
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="cookingTime"
                label="Thời gian nấu (phút)"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="servings"
                label="Khẩu phần (người)"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="ImageUrl"
                label="Ảnh món ăn"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  listType="picture"
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Title level={5}>Thông tin Dinh dưỡng</Title>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="calories"
                label="Calories"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} addonAfter="kcal" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="protein"
                label="Protein"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} addonAfter="g" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="carbs"
                label="Carbs"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} addonAfter="g" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="fat"
                label="Fat (Chất béo)"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} addonAfter="g" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="fiber"
                label="Fiber (Chất xơ)"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} addonAfter="g" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="sugar"
                label="Sugar (Đường)"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} addonAfter="g" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingDish ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Dinh dưỡng: ${nutritionModal?.name}`}
        open={nutritionModal !== null}
        onCancel={() => setNutritionModal(null)}
        footer={null}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Calories">
            {nutritionModal?.calories} kcal
          </Descriptions.Item>
          <Descriptions.Item label="Protein">
            {nutritionModal?.protein} g
          </Descriptions.Item>
          <Descriptions.Item label="Carbs">
            {nutritionModal?.carbs} g
          </Descriptions.Item>
          <Descriptions.Item label="Fat (Chất béo)">
            {nutritionModal?.fat} g
          </Descriptions.Item>
          <Descriptions.Item label="Fiber (Chất xơ)">
            {nutritionModal?.fiber} g
          </Descriptions.Item>
          <Descriptions.Item label="Sugar (Đường)">
            {nutritionModal?.sugar} g
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};

const MealPlanManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    data: menuData,
    loading: menuLoading,
    error: menuError,
  } = useAppSelector(
    (state) =>
      state.menu || {
        data: null,
        loading: false,
        error: null,
      }
  );
  const [, contextHolder] = Modal.useModal();

  const [createForm] = Form.useForm();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const [menuSearchTerm, setMenuSearchTerm] = useState<string>("");
  const [menuPagination, setMenuPagination] = useState<TablePaginationConfig>({
    current: 1, // Antd 1-based
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
  });

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  useEffect(() => {
    dispatch(
      getMenusThunk({
        pageNumber: menuPagination.current,
        pageSize: menuPagination.pageSize,
        searchTerm: menuSearchTerm || undefined,
      })
    );
  }, [
    dispatch,
    menuPagination.current,
    menuPagination.pageSize,
    menuSearchTerm,
  ]);

  useEffect(() => {
    setMenuPagination((prev) => ({
      ...prev,
      total: menuData?.count || 0,
      current: menuData?.pageIndex || 1,
      pageSize: menuData?.pageSize || 10,
    }));
  }, [menuData]);

  const handleMenuTableChange = (newPagination: TablePaginationConfig) => {
    setMenuPagination(newPagination);
  };

  const handleMenuSearch = (value: string) => {
    setMenuSearchTerm(value);
    setMenuPagination((prev) => ({ ...prev, current: 1 }));
  };

  const showCreateModal = () => {
    createForm.resetFields();
    setIsCreateModalVisible(true);
  };

  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
  };

  const onCreateFinish = async (values: any) => {
    const formData = new FormData();

    if (
      values.imageUrl &&
      values.imageUrl[0] &&
      values.imageUrl[0].originFileObj
    ) {
      formData.append("ImageUrl", values.imageUrl[0].originFileObj);
    }

    formData.append("MenuName", values.menuName);
    formData.append("MealsPerDay", values.mealsPerDay);
    formData.append("DailyCaloriesMin", values.dailyCaloriesMin);
    formData.append("DailyCaloriesMax", values.dailyCaloriesMax);
    if (values.description) formData.append("Description", values.description);

    try {
      await dispatch(createMenuThunk(formData)).unwrap();
      setIsCreateModalVisible(false);
      dispatch(
        getMenusThunk({
          pageNumber: menuPagination.current,
          pageSize: menuPagination.pageSize,
          searchTerm: menuSearchTerm || undefined,
        })
      );
    } catch (err) {
      console.error("Lỗi tạo menu:", err);
    }
  };

  const menuColumns: ColumnsType<MenuSummary> = [
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 80,
      render: (url, record) => (
        <Avatar shape="square" size={64} src={url} alt={record.menuName}>
          {record.menuName.charAt(0)}
        </Avatar>
      ),
    },
    { title: "Tên Thực đơn", dataIndex: "menuName", key: "menuName" },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Calories/ngày",
      key: "calories",
      width: 150,
      align: "center",
      render: (_, record) =>
        `${record.dailyCaloriesMin} - ${record.dailyCaloriesMax} kcal`,
    },
  ];

  return (
    <div>
      {contextHolder}
      <div className="flex justify-between items-center mb-4">
        <Title level={4}>Danh sách Thực đơn</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showCreateModal}
        >
          Tạo thực đơn mới
        </Button>
      </div>
      <Search
        placeholder="Tìm kiếm thực đơn..."
        onSearch={handleMenuSearch}
        style={{ marginBottom: 16 }}
        enterButton
        allowClear
      />

      {menuError && (
        <Alert
          message="Lỗi"
          description={menuError}
          type="error"
          showIcon
          closable
          onClose={() => dispatch(clearMenuError())}
          className="mb-4"
        />
      )}

      <Table
        columns={menuColumns}
        dataSource={menuData?.data}
        rowKey="id"
        loading={menuLoading}
        pagination={menuPagination}
        onChange={handleMenuTableChange}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title="Tạo Thực đơn mới"
        open={isCreateModalVisible}
        onCancel={handleCreateCancel}
        footer={null}
        width={600}
      >
        <Form form={createForm} layout="vertical" onFinish={onCreateFinish}>
          <Form.Item
            name="menuName"
            label="Tên Thực đơn"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả (tùy chọn)">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="mealsPerDay"
                label="Số bữa ăn/ngày"
                rules={[{ required: true, type: "number", min: 1 }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="imageUrl"
                label="Ảnh đại diện (tùy chọn)"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  listType="picture"
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dailyCaloriesMin"
                label="Calories tối thiểu/ngày"
                rules={[{ required: true, type: "number", min: 0 }]}
              >
                <InputNumber style={{ width: "100%" }} addonAfter="kcal" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dailyCaloriesMax"
                label="Calories tối đa/ngày"
                rules={[{ required: true, type: "number", min: 0 }]}
              >
                <InputNumber style={{ width: "100%" }} addonAfter="kcal" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={menuLoading}>
              Tạo mới
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default function RecipeManagement() {
  const tabItems: TabsProps["items"] = [
    { key: "1", label: "Quản lý Món ăn", children: <DishManager /> },
    { key: "2", label: "Quản lý Thực đơn", children: <MealPlanManager /> },
  ];
  return (
    <div className="p-6">
      <Tabs defaultActiveKey="1" items={tabItems} />
    </div>
  );
}
