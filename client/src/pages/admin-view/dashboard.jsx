import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";
import { fetchAllProducts } from "@/store/admin/products-slice";
import {
  BadgeDollarSign,
  ClipboardList,
  Package,
  TriangleAlert,
} from "lucide-react";
// Admin dashboard page
function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderList } = useSelector((state) => state.adminOrder);
  const { productList } = useSelector((state) => state.adminProducts);

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const orders = orderList || [];
  const products = productList || [];

  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const revenue = paidOrders.reduce(
    (sum, o) => sum + (Number(o.paidAmount ?? o.totalAmount) || 0),
    0
  );
  const pendingOrders = orders.filter((o) => o.orderStatus === "pending").length;
  const lowStock = products
    .filter((p) => Number(p.totalStock) <= 5)
    .sort((a, b) => Number(a.totalStock) - Number(b.totalStock))
    .slice(0, 5);
  const sponsoredCount = products.filter((p) => p.isSponsored).length;

  const stats = [
    {
      label: "Total Revenue (paid)",
      value: `Rs. ${revenue.toLocaleString()}`,
      icon: <BadgeDollarSign className="h-5 w-5 text-green-600" />,
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: <ClipboardList className="h-5 w-5 text-primary" />,
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: <ClipboardList className="h-5 w-5 text-gold" />,
    },
    {
      label: "Products",
      value: `${products.length} (${sponsoredCount} sponsored)`,
      icon: <Package className="h-5 w-5 text-primary" />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Store performance at a glance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Low Stock (≤ 5 left)</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/products")}
            >
              Manage products
            </Button>
          </CardHeader>
          <CardContent>
            {lowStock.length > 0 ? (
              <ul className="space-y-2">
                {lowStock.map((p) => (
                  <li
                    key={p._id}
                    className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <TriangleAlert className="h-4 w-4 shrink-0 text-gold" />
                      <span className="truncate">{p.title}</span>
                    </span>
                    <span className="font-semibold">{p.totalStock} left</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                All products are well stocked.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Latest Orders</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/orders")}
            >
              All orders
            </Button>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <ul className="space-y-2">
                {orders.slice(0, 5).map((o) => (
                  <li
                    key={o._id}
                    className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm"
                  >
                    <span className="truncate font-mono text-xs">
                      {String(o._id).slice(-8)}
                    </span>
                    <span className="font-semibold">
                      Rs. {o.totalAmount}
                    </span>
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                      {o.orderStatus} / {o.paymentStatus}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
