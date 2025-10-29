import { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Modal,
  Form,
  Select,
  Upload,
  Avatar,
  Typography,
  Alert,
  Image,
  Tag,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { SorterResult } from "antd/es/table/interface";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getExercisesThunk,
  deleteExerciseThunk,
  createExerciseThunk,
  updateExerciseThunk,
  clearExerciseError,
} from "../../features/exercises/exerciseSlice";
import type { Exercise } from "../../features/exercises/exerciseSlice";

const { Search } = Input;
const { Title, Paragraph } = Typography;

const getDifficultyText = (level: string | number): string => {
  const levelStr = String(level).toLowerCase();
  switch (levelStr) {
    case "0":
    case "beginner":
      return "Dễ";
    case "1":
    case "intermediate":
      return "Trung bình";
    case "2":
    case "advanced":
      return "Khó";
    default:
      return "Không xác định";
  }
};

const getDifficultyTagColor = (level: string | number): string => {
  const levelStr = String(level).toLowerCase();
  switch (levelStr) {
    case "0":
    case "beginner":
      return "green";
    case "1":
    case "intermediate":
      return "orange";
    case "2":
    case "advanced":
      return "red";
    default:
      return "default";
  }
};

const difficultyOptions = [
  { label: "Dễ", value: 0 },
  { label: "Trung bình", value: 1 },
  { label: "Khó", value: 2 },
];

export default function ExercisesManagement() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(
    (state) =>
      state.exercise || {
        data: null,
        loading: false,
        error: null,
      }
  );
  const [modal, contextHolder] = Modal.useModal();

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const [instructionModal, setInstructionModal] = useState<Exercise | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<number | undefined>(
    undefined
  );
  const [sortInfo, setSortInfo] = useState<SorterResult<Exercise>>({});

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 5,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
  });

  useEffect(() => {
    dispatch(
      getExercisesThunk({
        PageIndex: pagination.current,
        name: searchTerm || undefined,
        difficulty: difficultyFilter,
        isAscending: sortInfo.order === "ascend",
      })
    );
  }, [
    dispatch,
    pagination.current,
    pagination.pageSize,
    searchTerm,
    difficultyFilter,
    sortInfo,
  ]);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      total: data?.count || 0,
      current: data?.pageIndex || 1,
      pageSize: data?.pageSize || 10,
    }));
  }, [data]);

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, any>,
    sorter: SorterResult<Exercise> | SorterResult<Exercise>[]
  ) => {
    // mark filters as used to avoid TS6133 (declared but never read)
    void filters;
    setPagination(newPagination);
    setSortInfo(Array.isArray(sorter) ? sorter[0] : sorter);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleFilterChange = (value: number | undefined) => {
    setDifficultyFilter(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleAdd = () => {
    setEditingExercise(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Exercise) => {
    setEditingExercise(record);
    let formDifficulty: number | undefined;
    if (typeof record.difficulty === "string") {
      const lowerCaseDiff = record.difficulty.toLowerCase();
      if (lowerCaseDiff === "beginner") formDifficulty = 0;
      else if (lowerCaseDiff === "intermediate") formDifficulty = 1;
      else if (lowerCaseDiff === "advanced") formDifficulty = 2;
    } else if (
      typeof record.difficulty === "number" &&
      [0, 1, 2].includes(record.difficulty)
    ) {
      formDifficulty = record.difficulty;
    }

    form.setFieldsValue({
      name: record.name,
      description: record.description,
      instructions: record.instructions,
      difficulty: formDifficulty,
      gifFile: record.gifUrl
        ? [
            {
              uid: "-1",
              name: "Ảnh GIF hiện tại",
              status: "done",
              url: record.gifUrl,
            },
          ]
        : [],
    });
    setIsModalVisible(true);
  };

  const showDeleteConfirm = (record: Exercise) => {
    modal.confirm({
      title: `Bạn có chắc muốn xóa bài tập "${record.name}"?`,
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        dispatch(deleteExerciseThunk(record.id));
      },
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingExercise(null);
  };

  const onFinish = async (values: any) => {
    const formData = new FormData();

    if (
      values.gifFile &&
      values.gifFile[0] &&
      values.gifFile[0].originFileObj
    ) {
      formData.append("GifFile", values.gifFile[0].originFileObj);
    }

    formData.append("Name", values.name);
    formData.append("Difficulty", values.difficulty);
    if (values.description) formData.append("Description", values.description);
    if (values.instructions)
      formData.append("Instructions", values.instructions);

    try {
      if (editingExercise) {
        await dispatch(
          updateExerciseThunk({ id: editingExercise.id, formData })
        ).unwrap();
      } else {
        await dispatch(createExerciseThunk(formData)).unwrap();
      }

      setIsModalVisible(false);
      dispatch(
        getExercisesThunk({
          PageIndex: pagination.current,
          PageSize: pagination.pageSize,
          name: searchTerm || undefined,
          difficulty: difficultyFilter,
          isAscending: sortInfo.order === "ascend",
        })
      );
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };

  const columns: ColumnsType<Exercise> = [
    {
      title: "Ảnh GIF",
      dataIndex: "gifUrl",
      key: "gif",
      align: "center",
      width: 100,
      render: (url, record) =>
        url ? (
          <Image
            src={url}
            alt={record.name}
            width={80}
            preview={{ mask: <EyeOutlined /> }}
          />
        ) : (
          <Avatar shape="square" size={64}>
            {record.name.charAt(0)}
          </Avatar>
        ),
    },
    {
      title: "Tên bài tập",
      dataIndex: "name",
      key: "name",
      sorter: true,
      sortOrder: sortInfo.field === "name" ? sortInfo.order : undefined,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Hướng dẫn",
      key: "instructions",
      align: "center",
      width: 100,
      render: (_, record) =>
        record.instructions ? (
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => setInstructionModal(record)}
          />
        ) : (
          "N/A"
        ),
    },
    {
      title: "Mức độ",
      dataIndex: "difficulty",
      key: "difficulty",
      align: "center",
      width: 120,
      render: (level: string | number) => (
        <Tag color={getDifficultyTagColor(level)}>
          {getDifficultyText(level)}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      fixed: "right",
      width: 120,
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
    <div className="p-6">
      {contextHolder}

      <div className="flex justify-between items-center mb-4">
        <Title level={3}>Quản lý Bài tập</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm bài tập
        </Button>
      </div>

      <Space className="mb-4">
        <Search
          placeholder="Tìm theo tên bài tập..."
          onSearch={handleSearch}
          style={{ width: 300 }}
          enterButton
          allowClear
        />
        <Select
          placeholder="Lọc theo mức độ"
          allowClear
          style={{ width: 200 }}
          onChange={handleFilterChange}
          options={difficultyOptions}
          value={difficultyFilter}
        />
      </Space>

      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => dispatch(clearExerciseError())}
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
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={editingExercise ? "Chỉnh sửa bài tập" : "Thêm bài tập mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Tên bài tập"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Mô tả (tùy chọn)">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="instructions" label="Hướng dẫn (tùy chọn)">
            <Input.TextArea rows={5} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="difficulty"
                label="Mức độ"
                rules={[{ required: true }]}
              >
                <Select options={difficultyOptions} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gifFile"
                label="Ảnh GIF (tùy chọn)"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  listType="picture"
                  beforeUpload={() => false}
                  maxCount={1}
                  accept="image/gif,image/jpeg,image/png,image/webp"
                >
                  <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingExercise ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Hướng dẫn: ${instructionModal?.name}`}
        open={instructionModal !== null}
        onCancel={() => setInstructionModal(null)}
        footer={[
          <Button key="back" onClick={() => setInstructionModal(null)}>
            Đóng
          </Button>,
        ]}
      >
        {instructionModal?.instructions ? (
          instructionModal.instructions.split("; ").map((step, index) => (
            <div key={index} style={{ marginBottom: "8px" }}>
              {step}
              {step.endsWith(".") ? "" : "."}
            </div>
          ))
        ) : (
          <Paragraph>Không có hướng dẫn chi tiết.</Paragraph>
        )}
      </Modal>
    </div>
  );
}
