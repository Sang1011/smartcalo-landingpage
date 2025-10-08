import { useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Modal,
  Form,
  InputNumber,
  Tabs,
  Tag,
  Upload,
  Avatar,
  Select,
  Card,
  Collapse,
  List,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Search } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;

// --- DỮ LIỆU VÀ KIỂU DỮ LIỆU CHO MÓN ĂN (RECIPES) ---

interface RecipeDataType {
  key: string;
  id: string;
  name: string;
  calories: number;
  category: string;
  imageUrl?: string;
  description?: string;
  ingredients?: string;
  instructions?: string;
  createdBy: string;
}

const initialRecipes: RecipeDataType[] = [
  {
    key: "1",
    id: "REC001",
    name: "Trứng ốp la",
    calories: 84,
    createdBy: "Admin",
    category: "Món mặn",
    imageUrl: "/images/dish_egg.png",
  },
  {
    key: "2",
    id: "REC002",
    name: "Bánh mì Sandwich",
    calories: 144,
    createdBy: "Admin",
    category: "Món mặn",
    imageUrl: "/images/dish_sandwich.png",
  },
  {
    key: "3",
    id: "REC003",
    name: "Rau xà lách",
    calories: 12,
    createdBy: "Nguyễn Văn An",
    category: "Món chay",
    imageUrl: "/images/dish_salad.png",
  },
  {
    key: "4",
    id: "REC004",
    name: "Súp lơ xanh luộc",
    calories: 40,
    createdBy: "Admin",
    category: "Món chay",
    imageUrl: "/images/dish_brocoli.png",
  },
];

// --- DỮ LIỆU VÀ KIỂU DỮ LIỆU CHO THỰC ĐƠN (MEAL PLANS) ---

interface MealPlanSchedule {
  [day: string]: {
    breakfast: string[]; // Mảng các recipe ID
    lunch: string[];
    dinner: string[];
  };
}

interface MealPlanDataType {
  key: string;
  id: string;
  name: string;
  description: string;
  totalCalories: number;
  schedule: MealPlanSchedule;
}

const initialMealPlans: MealPlanDataType[] = [
  {
    key: "1",
    id: "MP001",
    name: "Thực đơn giảm cân 7 ngày",
    description:
      "Thực đơn ít calo, giàu protein và chất xơ giúp giảm cân hiệu quả.",
    totalCalories: 10500,
    schedule: {
      "Thứ 2": {
        breakfast: ["REC002"],
        lunch: ["REC001", "REC004"],
        dinner: ["REC003"],
      },
      "Thứ 3": {
        breakfast: ["REC002"],
        lunch: ["REC001", "REC004"],
        dinner: ["REC003"],
      },
      // ... thêm dữ liệu cho các ngày khác
    },
  },
  {
    key: "2",
    id: "MP002",
    name: "Thực đơn tăng cơ",
    description:
      "Thực đơn giàu calo và protein để hỗ trợ quá trình xây dựng cơ bắp.",
    totalCalories: 17500,
    schedule: {},
  },
];

// --- COMPONENT CON: QUẢN LÝ MÓN ĂN ---

const DishManager = () => {
  const [recipes, setRecipes] = useState<RecipeDataType[]>(initialRecipes);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<RecipeDataType | null>(
    null
  );
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  const handleEdit = (record: RecipeDataType) => {
    setEditingRecipe(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa món ăn này?",
      onOk: () => setRecipes(recipes.filter((recipe) => recipe.key !== key)),
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRecipe(null);
  };

  const onFinish = (values: any) => {
    // Tạm thời xử lý upload ảnh
    const imageUrl = values.upload?.[0]?.thumbUrl || editingRecipe?.imageUrl;

    if (editingRecipe) {
      setRecipes(
        recipes.map((r) =>
          r.key === editingRecipe.key
            ? { ...editingRecipe, ...values, imageUrl }
            : r
        )
      );
    } else {
      const newRecipe: RecipeDataType = {
        ...values,
        imageUrl,
        key: `REC${Date.now()}`,
        id: `REC${(recipes.length + 1).toString().padStart(3, "0")}`,
        createdBy: "Admin",
      };
      setRecipes([...recipes, newRecipe]);
    }
    setIsModalVisible(false);
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<RecipeDataType> = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Tên món ăn",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <Avatar src={record.imageUrl} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Lượng Calo (kcal)",
      dataIndex: "calories",
      key: "calories",
      sorter: (a, b) => a.calories - b.calories,
    },
    { title: "Danh mục", dataIndex: "category", key: "category" },
    { title: "Người tạo", dataIndex: "createdBy", key: "createdBy" },
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
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Search
          placeholder="Tìm kiếm theo tên món ăn..."
          onSearch={(value) => setSearchText(value)}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingRecipe(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Thêm món ăn mới
        </Button>
      </div>
      <Table columns={columns} dataSource={filteredRecipes} rowKey="key" />
      <Modal
        title={editingRecipe ? "Chỉnh sửa món ăn" : "Thêm món ăn mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Tên món ăn"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="calories"
                label="Lượng Calo (kcal)"
                rules={[{ required: true, type: "number", min: 0 }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Mô tả ngắn">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="ingredients" label="Nguyên liệu">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="instructions" label="Hướng dẫn">
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item name="upload" label="Hình ảnh">
            <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

// --- COMPONENT CON: QUẢN LÝ THỰC ĐƠN ---

const MealPlanManager = () => {
  const [mealPlans, setMealPlans] =
    useState<MealPlanDataType[]>(initialMealPlans);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<MealPlanDataType | null>(null);

  const handleViewDetails = (record: MealPlanDataType) => {
    setCurrentPlan(record);
    setIsDetailVisible(true);
  };

  const getRecipeNameById = (id: string) => {
    return (
      initialRecipes.find((r) => r.id === id)?.name || "Món ăn không tồn tại"
    );
  };

  const columns: ColumnsType<MealPlanDataType> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên thực đơn", dataIndex: "name", key: "name" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Tổng Calo (ước tính)",
      dataIndex: "totalCalories",
      key: "totalCalories",
      render: (val) => `${val.toLocaleString("vi-VN")} kcal`,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            Xem chi tiết
          </Button>
          <Button type="primary" icon={<EditOutlined />}>
            Sửa
          </Button>
          <Button type="primary" danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, textAlign: "right" }}>
        <Button type="primary" icon={<PlusOutlined />}>
          Tạo thực đơn mới
        </Button>
      </div>
      <Table columns={columns} dataSource={mealPlans} rowKey="key" />

      {/* Modal xem chi tiết */}
      <Modal
        title={`Chi tiết: ${currentPlan?.name}`}
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={<Button onClick={() => setIsDetailVisible(false)}>Đóng</Button>}
        width={1000}
      >
        {currentPlan && (
          <Collapse defaultActiveKey={["Thứ 2"]}>
            {Object.keys(currentPlan.schedule).map((day) => (
              <Panel header={day} key={day}>
                <Row gutter={16}>
                  <Col span={8}>
                    <Card title="Bữa sáng">
                      <List
                        dataSource={currentPlan.schedule[day].breakfast}
                        renderItem={(recipeId) => (
                          <List.Item>{getRecipeNameById(recipeId)}</List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card title="Bữa trưa">
                      <List
                        dataSource={currentPlan.schedule[day].lunch}
                        renderItem={(recipeId) => (
                          <List.Item>{getRecipeNameById(recipeId)}</List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card title="Bữa tối">
                      <List
                        dataSource={currentPlan.schedule[day].dinner}
                        renderItem={(recipeId) => (
                          <List.Item>{getRecipeNameById(recipeId)}</List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                </Row>
              </Panel>
            ))}
          </Collapse>
        )}
      </Modal>
    </>
  );
};

// --- COMPONENT CHÍNH: KẾT HỢP 2 PHẦN ---

export default function RecipeManagement() {
  return (
    <Card>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Quản lý Thực đơn" key="1">
          <MealPlanManager />
        </TabPane>
        <TabPane tab="Quản lý Món ăn" key="2">
          <DishManager />
        </TabPane>
      </Tabs>
    </Card>
  );
}
