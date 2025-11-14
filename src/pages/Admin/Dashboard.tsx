import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  DatePicker,
  Skeleton,
  Alert,
} from "antd";
import { Line, Pie } from "@ant-design/charts";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getDashboardDataThunk } from "../../features/dashboard/dashboardSlice";

dayjs.locale("vi");

const { Title, Text } = Typography;

const MONTH_NAMES = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

type RawPoint = {
  name?: string | number;
  month?: string | number;
  value?: number | null;
};

function parseMonthFromName(name: string | number | undefined): number | null {
  if (typeof name === "number") return name;
  if (!name) return null;
  const match = String(name).match(/\d+/);
  return match ? Number(match[0]) : null;
}

function normalizeMonthlyData(raw: RawPoint[] = []) {
  const map = new Map<number, number>();
  raw.forEach((item) => {
    const rawName = item.month ?? item.name;
    const n = parseMonthFromName(rawName);
    if (n && n >= 1 && n <= 12) {
      map.set(n, item.value == null ? 0 : item.value);
    }
  });

  return MONTH_NAMES.map((label, idx) => {
    const monthIndex = idx + 1;
    return {
      name: label,
      value: map.has(monthIndex) ? map.get(monthIndex)! : 0,
    };
  });
}

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.dashboard);

  const [revenueYear, setRevenueYear] = useState(dayjs());
  const [transactionYear, setTransactionYear] = useState(dayjs());

  useEffect(() => {
    dispatch(getDashboardDataThunk({ year: revenueYear.year() }));
  }, [dispatch, revenueYear]);

  useEffect(() => {
    dispatch(getDashboardDataThunk({ year: transactionYear.year() }));
  }, [dispatch, transactionYear]);

  if (loading && !data) {
    return (
      <div className="p-6">
        <Skeleton active />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!data) {
    return <div className="p-6">Không có dữ liệu.</div>;
  }

  const { revenueReport, transactionReport, userDemographics } =
    data;

  const currentYear = dayjs().year();
  const currentMonth = dayjs().month() + 1;

  const normalizedRevenue12 = normalizeMonthlyData(
    revenueReport.monthlyRevenue
  );
  const normalizedTransaction12 = normalizeMonthlyData(
    transactionReport.monthlyTransactions
  );

  const revenueDataForChart =
    revenueYear.year() === currentYear
      ? normalizedRevenue12.slice(0, currentMonth)
      : normalizedRevenue12;
  const transactionDataForChart =
    transactionYear.year() === currentYear
      ? normalizedTransaction12.slice(0, currentMonth)
      : normalizedTransaction12;

  const totalRevenueForYear = revenueDataForChart.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );
  const totalTransactionsForYear = transactionDataForChart.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );

  const userDemographicsData = [
    { type: "Free", value: userDemographics.freeUsers },
    { type: "Premium", value: userDemographics.premiumUsers },
  ];

  return (
    <div className="p-6 bg-gray-100">
      <Title level={2} className="mb-6">
        Bảng thống kê
      </Title>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenueForYear}
              suffix="VND"
              precision={0}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Tổng người dùng"
              value={userDemographics.totalUsers}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Tổng giao dịch"
              value={totalTransactionsForYear}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
        <Card loading={loading}>
  <Title level={5}>Đánh giá trung bình</Title>
  {/* Áp dụng một style CSS để giữ nội dung trên một dòng */}
  <Text 
    className="ml-2" 
    style={{ whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}
  >
    Link (APK Pure):{" "}
    <a
      href={"https://apkpure.com/reviews/com.penta.smartcalo"}
      target="_blank"
      rel="noreferrer"
    >
      Reviews
    </a>
  </Text>
</Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            loading={loading}
            title={
              <div className="flex justify-between items-center">
                <span>Doanh thu năm {revenueYear.year()}</span>
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
              Tổng năm: {totalRevenueForYear.toLocaleString("vi-VN")} VND
            </Title>
            <Line
              data={revenueDataForChart}
              xField="name"
              yField="value"
              point={{ size: 4 }}
              tooltip={{
                formatter: (d: any) => ({
                  name: "Doanh thu",
                  value: d.value.toLocaleString("vi-VN") + " VND",
                }),
              }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card loading={loading} title="Phân bổ người dùng">
            <Pie
              data={userDemographicsData}
              angleField="value"
              colorField="type"
              radius={0.8}
              label={{
                type: "inner",
                offset: "-50%",
                content: "{value} ({percentage})",
                style: { textAlign: "center", fontSize: 14 },
              }}
              interactions={[{ type: "element-active" }]}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            loading={loading}
            title={
              <div className="flex justify-between items-center">
                <span>Số lượng giao dịch năm {transactionYear.year()}</span>
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
              data={transactionDataForChart}
              xField="name"
              yField="value"
              point={{ size: 4 }}
              tooltip={{
                formatter: (d: any) => ({
                  name: "Giao dịch",
                  value: d.value.toLocaleString("vi-VN"),
                }),
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
