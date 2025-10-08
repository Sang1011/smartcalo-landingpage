import { useState } from "react";
import { Table, Input, Button, Space, Modal, Form, Select, Tag } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Search } = Input;
const { Option } = Select;

// Định nghĩa kiểu dữ liệu cho một Bài tập
interface WorkoutDataType {
  key: string;
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: "easy" | "medium" | "hard";
}

// Dữ liệu giả lập
const initialWorkouts: WorkoutDataType[] = [
  {
    key: "1",
    id: "WK001",
    name: "Hít đất (Push-up)",
    muscleGroup: "Ngực, Tay sau",
    difficulty: "medium",
  },
  {
    key: "2",
    id: "WK002",
    name: "Gánh tạ (Squat)",
    muscleGroup: "Chân, Mông",
    difficulty: "medium",
  },
  {
    key: "3",
    id: "WK003",
    name: "Plank",
    muscleGroup: "Bụng",
    difficulty: "easy",
  },
  {
    key: "4",
    id: "WK004",
    name: "Kéo xà (Pull-up)",
    muscleGroup: "Lưng, Tay trước",
    difficulty: "hard",
  },
];

export default function WorkoutManagement() {
  const [workouts, setWorkouts] = useState<WorkoutDataType[]>(initialWorkouts);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutDataType | null>(
    null
  );
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingWorkout(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: WorkoutDataType) => {
    setEditingWorkout(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa bài tập này?",
      onOk: () => {
        setWorkouts(workouts.filter((item) => item.key !== key));
      },
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingWorkout(null);
  };

  const onFinish = (values: any) => {
    if (editingWorkout) {
      setWorkouts(
        workouts.map((w) =>
          w.key === editingWorkout.key ? { ...editingWorkout, ...values } : w
        )
      );
    } else {
      const newWorkout = {
        ...values,
        key: (workouts.length + 1).toString(),
        id: `WK${(workouts.length + 1).toString().padStart(3, "0")}`,
      };
      setWorkouts([...workouts, newWorkout]);
    }
    setIsModalVisible(false);
  };

  const handleSearch = (value: string) => {
    setSearchText(value.toLowerCase());
  };

  const filteredWorkouts = workouts.filter((workout) =>
    workout.name.toLowerCase().includes(searchText)
  );

  const columns: ColumnsType<WorkoutDataType> = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Tên bài tập",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    { title: "Nhóm cơ tác động", dataIndex: "muscleGroup", key: "muscleGroup" },
    {
      title: "Mức độ",
      dataIndex: "difficulty",
      key: "difficulty",
      render: (level: string) => {
        let color = "green";
        let text = "Dễ";
        if (level === "medium") {
          color = "orange";
          text = "Trung bình";
        }
        if (level === "hard") {
          color = "red";
          text = "Khó";
        }
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: "Dễ", value: "easy" },
        { text: "Trung bình", value: "medium" },
        { text: "Khó", value: "hard" },
      ],
      onFilter: (value, record) => record.difficulty === value,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => handleEdit(record)}>
            Xem
          </Button>
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
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Search
          placeholder="Tìm kiếm theo tên bài tập..."
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm bài tập mới
        </Button>
      </div>
      <Table columns={columns} dataSource={filteredWorkouts} rowKey="key" />

      <Modal
        title={editingWorkout ? "Chỉnh sửa bài tập" : "Thêm bài tập mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Tên bài tập"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="muscleGroup"
            label="Nhóm cơ tác động"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="difficulty"
            label="Mức độ"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="easy">Dễ</Option>
              <Option value="medium">Trung bình</Option>
              <Option value="hard">Khó</Option>
            </Select>
          </Form.Item>
          <Form.Item name="videoUrl" label="Link Video hướng dẫn">
            <Input placeholder="https://www.youtube.com/watch?v=..." />
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
