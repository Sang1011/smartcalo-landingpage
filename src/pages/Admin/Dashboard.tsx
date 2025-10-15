import { useState } from "react";
import { Row, Col, Card, Statistic, Typography, Rate, DatePicker } from "antd";
import { Line, Pie, Column } from "@ant-design/charts";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

const { Title, Text } = Typography;

// --- DỮ LIỆU GIẢ LẬP ---

// 1. Dữ liệu tổng quan cho các Card ()
const overallStats = {
  totalRevenue: 185075000,
  totalUsers: 1950,
  totalTransactions: 4890,
  totalReviews: 875,
  averageRating: 4.3,
};

// 2. Dữ liệu lịch sử theo năm và tháng
const generateHistoricalData = () => {
  const data: { [year: number]: any[] } = {};
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2]; //Cho tạm dữ liệu 3 năm để show

  years.forEach((year) => {
    data[year] = [];
    for (let month = 0; month < 12; month++) {
      data[year].push({
        month: `Thg ${month + 1}`,
        doanhThu:
          Math.floor(Math.random() * (12000000 - 4000000 + 1)) + 4000000,
        giaoDich: Math.floor(Math.random() * (450 - 100 + 1)) + 100,
      });
    }
  });
  return data;
};
const historicalData = generateHistoricalData();

// 3. Dữ liệu phân bổ người dùng
const userDistributionData = [
  { type: "Miễn phí", value: 100 },
  { type: "Gói tháng", value: 50 },
  { type: "Gói năm", value: 25 },
];

// 4. Dữ liệu đánh giá theo sao (tổng hợp)
const totalReviewData = [
  { star: "1 sao", count: 10 },
  { star: "2 sao", count: 20 },
  { star: "3 sao", count: 30 },
  { star: "4 sao", count: 40 },
  { star: "5 sao", count: 50 },
];

export default function Dashboard() {
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();

  const [revenueYear, setRevenueYear] = useState(dayjs());
  const [transactionYear, setTransactionYear] = useState(dayjs());

  // Lọc và tính toán dữ liệu cho biểu đồ doanh thu
  const selectedRevenueYear = revenueYear.year();
  const revenueDataForYear = (historicalData[selectedRevenueYear] || []).slice(
    0,
    selectedRevenueYear === currentYear ? currentMonthIndex + 1 : 12
  );
  const totalRevenueForYear = revenueDataForYear.reduce(
    (sum, item) => sum + item.doanhThu,
    0
  );

  // Lọc và tính toán dữ liệu cho biểu đồ giao dịch
  const selectedTransactionYear = transactionYear.year();
  const transactionDataForYear = (
    historicalData[selectedTransactionYear] || []
  ).slice(
    0,
    selectedTransactionYear === currentYear ? currentMonthIndex + 1 : 12
  );
  const totalTransactionsForYear = transactionDataForYear.reduce(
    (sum, item) => sum + item.giaoDich,
    0
  );

  return (
    <div>
      <Title level={2} style={{ marginBottom: "24px" }}>
        Bảng thống kê
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={overallStats.totalRevenue}
              suffix="₫"
              groupSeparator="."
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={overallStats.totalUsers}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số giao dịch"
              value={overallStats.totalTransactions}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số đánh giá"
              value={overallStats.totalReviews}
            />
            <div
              style={{ display: "flex", alignItems: "center", marginTop: 8 }}
            >
              <Rate
                disabled
                allowHalf
                value={overallStats.averageRating}
                style={{ fontSize: 16 }}
              />
              <Text strong style={{ marginLeft: 8, color: "#faad14" }}>
                {overallStats.averageRating.toFixed(1)}
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ 1: Doanh thu */}
      <Row gutter={[16, 16]} style={{ marginTop: "32px" }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Doanh thu năm {selectedRevenueYear}</span>
                <DatePicker
                  picker="year"
                  defaultValue={revenueYear}
                  onChange={(date) => setRevenueYear(date || dayjs())}
                  allowClear={false}
                />
              </div>
            }
          >
            <Title level={4}>
              Tổng năm: {totalRevenueForYear.toLocaleString("vi-VN")} ₫
            </Title>
            <Line
              data={revenueDataForYear}
              xField="month"
              yField="doanhThu"
              point={{ size: 4 }}
              yAxis={{
                label: {
                  formatter: (v: any) => `${(v / 1000000).toFixed(0)}tr`,
                },
              }}
              tooltip={{
                formatter: (d: any) => ({
                  name: "Doanh thu",
                  value: `${d.doanhThu.toLocaleString("vi-VN")} ₫`,
                }),
              }}
            />
          </Card>
        </Col>
        {/* Biểu đồ 2: Chia loại user */}
        <Col xs={24} lg={12}>
          <Card title="Phân bổ người dùng">
            <Pie
              data={userDistributionData}
              angleField="value"
              colorField="type"
              radius={0.75}
              label={{
                type: "inner",
                offset: "-50%",
                content: ({ percent }: { percent: number }) =>
                  `${(percent * 100).toFixed(0)}%`,
              }}
              legend={{ position: "top" }}
              interactions={[{ type: "element-active" }]}
              tooltip={{
                formatter: (d: any) => ({
                  name: d.type,
                  value: `${d.value.toLocaleString("vi-VN")} người`,
                }),
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ 3: Giao dịch */}
      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Số lượng giao dịch năm {selectedTransactionYear}</span>
                <DatePicker
                  picker="year"
                  defaultValue={transactionYear}
                  onChange={(date) => setTransactionYear(date || dayjs())}
                  allowClear={false}
                />
              </div>
            }
          >
            <Title level={4}>
              Tổng năm: {totalTransactionsForYear.toLocaleString("vi-VN")} giao
              dịch
            </Title>
            <Line
              data={transactionDataForYear}
              xField="month"
              yField="giaoDich"
              point={{ size: 4 }}
              tooltip={{
                formatter: (d: any) => ({
                  name: "Giao dịch",
                  value: d.giaoDich.toLocaleString("vi-VN"),
                }),
              }}
            />
          </Card>
        </Col>
        {/* Biểu đồ 4: Đánh giá */}
        <Col xs={24} lg={12}>
          <Card title="Phân bổ lượng đánh giá">
            <Column
              data={totalReviewData}
              xField="star"
              yField="count"
              xAxis={{ label: { autoRotate: false } }}
              tooltip={{
                formatter: (d: any) => ({ name: "Số lượng", value: d.count }),
              }}
              label={{ position: "middle", style: { fill: "#fff" } }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
