import { Row, Col, Card, Statistic, Typography } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarCircleOutlined,
  UserOutlined,
  FileDoneOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { Line } from "@ant-design/charts";

const { Title } = Typography;

// --- DỮ LIỆU GỐC CỦA BẠN CHO THÁNG HIỆN TẠI ---
const currentMonthStats = {
  doanhThu: 635000,
  nguoiDungMoi: 4,
  goiThang: 1,
  goiNam: 2,
};

// --- HÀM MỚI: TẠO DỮ LIỆU GIẢ LẬP CHO 12 THÁNG DỰA TRÊN DỮ LIỆU THÁNG HIỆN TẠI ---
const generateHistoricalData = () => {
  const data = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = `Thg ${date.getMonth() + 1}/${date
      .getFullYear()
      .toString()
      .slice(-2)}`;

    // Sử dụng dữ liệu thật cho tháng gần nhất (i=0)
    // Các tháng trước đó sẽ được tạo ngẫu nhiên nhưng hợp lý
    if (i === 0) {
      data.push({ month, ...currentMonthStats });
    } else {
      data.push({
        month: month,
        doanhThu: Math.floor(
          currentMonthStats.doanhThu * (1 + (Math.random() - 0.5) * 0.5)
        ),
        nguoiDungMoi: Math.floor(
          Math.random() * (currentMonthStats.nguoiDungMoi + 5)
        ),
        goiThang: Math.floor(Math.random() * (currentMonthStats.goiThang + 3)),
        goiNam: Math.floor(Math.random() * (currentMonthStats.goiNam + 2)),
      });
    }
  }
  return data;
};

// --- HÀM MỚI: TÍNH TOÁN TỶ LỆ THAY ĐỔI GIỮA 2 THÁNG ---
const calculateChange = (current: number, previous: number): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0; // Nếu tháng trước là 0, coi như tăng 100%
  }
  const change = ((current - previous) / previous) * 100;
  return parseFloat(change.toFixed(1)); // Làm tròn đến 1 chữ số thập phân
};

export default function Dashboard() {
  // Tạo dữ liệu lịch sử một lần
  const historicalData = generateHistoricalData();

  // Lấy dữ liệu của tháng hiện tại và tháng trước
  const currentMonthData = historicalData[historicalData.length - 1];
  const previousMonthData = historicalData[historicalData.length - 2];

  // Tạo dữ liệu cho các thẻ thống kê với % thay đổi được tính toán động
  const statsData = [
    {
      title: "Tổng doanh thu tháng",
      value: currentMonthData.doanhThu,
      precision: 0,
      prefix: "₫",
      suffix: "",
      change: calculateChange(
        currentMonthData.doanhThu,
        previousMonthData.doanhThu
      ),
      icon: <DollarCircleOutlined style={{ color: "green" }} />,
      dataKey: "doanhThu",
    },
    {
      title: "Người dùng mới trong tháng",
      value: currentMonthData.nguoiDungMoi,
      precision: 0,
      prefix: "",
      suffix: "",
      change: calculateChange(
        currentMonthData.nguoiDungMoi,
        previousMonthData.nguoiDungMoi
      ),
      icon: <UserOutlined style={{ color: "blue" }} />,
      dataKey: "nguoiDungMoi",
    },
    {
      title: "Gói tháng đăng ký",
      value: currentMonthData.goiThang,
      precision: 0,
      prefix: "",
      suffix: " người",
      change: calculateChange(
        currentMonthData.goiThang,
        previousMonthData.goiThang
      ),
      icon: <FileDoneOutlined style={{ color: "orange" }} />,
      dataKey: "goiThang",
    },
    {
      title: "Gói năm đăng ký",
      value: currentMonthData.goiNam,
      precision: 0,
      prefix: "",
      suffix: " người",
      change: calculateChange(
        currentMonthData.goiNam,
        previousMonthData.goiNam
      ),
      icon: <CrownOutlined style={{ color: "purple" }} />,
      dataKey: "goiNam",
    },
  ];

  // Cấu hình chung cho biểu đồ
  const lineChartConfig = {
    data: historicalData,
    xField: "month",
    point: { size: 5, shape: "diamond" },
    height: 300,
  };

  return (
    <div>
      <Title level={2} style={{ marginBottom: "24px" }}>
        Bảng thống kê
      </Title>

      <Row gutter={[16, 16]}>
        {statsData.map((stat) => (
          <Col xs={24} sm={12} md={12} lg={6} key={stat.title}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                precision={stat.precision}
                prefix={stat.prefix}
                suffix={stat.suffix}
                valueStyle={{ color: stat.change > 0 ? "#3f8600" : "#cf1322" }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "8px",
                  color: stat.change >= 0 ? "green" : "red",
                }}
              >
                {stat.change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                <span style={{ marginLeft: "4px" }}>
                  {Math.abs(stat.change)}% so với tháng trước
                </span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "32px" }}>
        <Col xs={24} lg={12}>
          <Card title="Doanh thu 12 tháng gần nhất">
            <Line
              {...lineChartConfig}
              yField="doanhThu"
              tooltip={{
                formatter: (datum: any) => ({
                  name: "Doanh thu",
                  value: `${datum.doanhThu.toLocaleString("vi-VN")} ₫`,
                }),
              }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Người dùng mới 12 tháng gần nhất">
            <Line
              {...lineChartConfig}
              yField="nguoiDungMoi"
              tooltip={{
                formatter: (datum: any) => ({
                  name: "Người dùng mới",
                  value: `${datum.nguoiDungMoi.toLocaleString("vi-VN")}`,
                }),
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* --- BIỂU ĐỒ BỔ SUNG CHO 2 CHỈ SỐ CÒN LẠI --- */}
      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        <Col xs={24} lg={12}>
          <Card title="Gói tháng đăng ký 12 tháng gần nhất">
            <Line
              {...lineChartConfig}
              yField="goiThang"
              tooltip={{
                formatter: (datum: any) => ({
                  name: "Gói tháng",
                  value: `${datum.goiThang.toLocaleString("vi-VN")} người`,
                }),
              }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Gói năm đăng ký 12 tháng gần nhất">
            <Line
              {...lineChartConfig}
              yField="goiNam"
              tooltip={{
                formatter: (datum: any) => ({
                  name: "Gói năm",
                  value: `${datum.goiNam.toLocaleString("vi-VN")} người`,
                }),
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
