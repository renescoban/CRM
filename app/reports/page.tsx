import { Suspense } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderModel } from '@/models/OrderModel';
import { ContactModel } from '@/models/ContactModel';
import { PaymentModel } from '@/models/PaymentModel';
import { TagModel } from '@/models/TagsModel';
import { ActivityModel } from '@/models/ActivityModel';
import dynamic from 'next/dynamic';

// Dynamically import components with loading fallbacks
const ReportsClient = dynamic(() => import('./client'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
});

const OrderPaymentChart = dynamic(() => import('./OrderPaymentChart'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
});

const PredictiveAnalytics = dynamic(() => import('./PredictiveAnalytics'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
});

export const metadata: Metadata = {
  title: "Reports",
  description: "...",
};

interface ProcessedTag {
  name: string;
  count: number;
}

// Memoize data fetching functions
const getActivities = async () => {
  try {
    return await ActivityModel.getAllType();
  } catch {
    return [];
  }
};

const getTags = async (): Promise<ProcessedTag[]> => {
  try {
    return await TagModel.getTagCounts("contact") as ProcessedTag[];
  } catch (error) {
    console.error("err: ", error);
    return [];
  }
};

const calculateMetrics = (orders: any[], contacts: any[]) => {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const AOV = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const customerData = new Map();
  orders.forEach((order) => {
    const customerId = order.contact_id;
    const orderDate = new Date(order.created_at);
    
    if (!customerData.has(customerId)) {
      customerData.set(customerId, {
        revenue: 0,
        orderCount: 0,
        firstOrderDate: orderDate,
        lastOrderDate: orderDate
      });
    }
    
    const customer = customerData.get(customerId);
    customer.revenue += order.total;
    customer.orderCount += 1;
    customer.firstOrderDate = orderDate < customer.firstOrderDate ? orderDate : customer.firstOrderDate;
    customer.lastOrderDate = orderDate > customer.lastOrderDate ? orderDate : customer.lastOrderDate;
  });

  const totalCustomers = contacts.length;
  const CLV = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
  const repeatCustomers = Array.from(customerData.values()).filter(c => c.orderCount > 1).length;
  const retentionRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

  return { totalRevenue, totalOrders, AOV, CLV, retentionRate };
};

const getReportData = async () => {
  const [orders, contacts, payments] = await Promise.all([
    OrderModel.getAll(),
    ContactModel.getAll(),
    PaymentModel.getAll()
  ]);

  const metrics = calculateMetrics(orders, contacts);
  
  // Calculate monthly sales for the last 12 months
  const monthlySales = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = date.toISOString().slice(0, 7);
    const monthOrders = orders.filter(order => order.created_at.startsWith(monthKey));
    return {
      month: monthKey,
      sales: monthOrders.reduce((sum, order) => sum + order.total, 0)
    };
  }).reverse();

  return { orders, payments, ...metrics, monthlySales };
};

const MetricCard = ({ title, value, format = (v: any) => v }: {title:string, value:number, format?: (value: any) => string; }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">{format(value)}</p>
    </CardContent>
  </Card>
);

export default async function Reports() {
  const [activities, tags, reportData] = await Promise.all([
    getActivities(),
    getTags(),
    getReportData()
  ]);
  
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Reports</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <MetricCard title="Total Revenue" value={reportData.totalRevenue} format={v => `$${v.toFixed(2)}`} />
          <MetricCard title="Total Orders" value={reportData.totalOrders} />
          <MetricCard title="Average Order Value (AOV)" value={reportData.AOV} format={v => `$${v.toFixed(2)}`} />
          <MetricCard title="Customer Lifetime Value (CLV)" value={reportData.CLV} format={v => `$${v.toFixed(2)}`} />
          <MetricCard title="Retention Rate" value={reportData.retentionRate} format={v => `${v.toFixed(2)}%`} />
        </div>

        <div className="md:flex">
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
            <OrderPaymentChart dataX={reportData.orders} dataY={reportData.payments} />
          </Suspense>
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>}>
            <PredictiveAnalytics monthlySales={reportData.monthlySales} />
          </Suspense>
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>}>
            <ReportsClient initialActivities={activities} initialTags={tags} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}