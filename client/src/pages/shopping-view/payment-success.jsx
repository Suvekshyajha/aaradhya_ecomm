import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getOrderDetails, resetOrderDetails } from "@/store/shop/order-slice";
import { useSEO } from "@/components/common/seo";
import { trackPurchase } from "@/lib/analytics";

function PaymentSuccessPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { orderDetails } = useSelector((state) => state.shopOrder);

  const orderId = new URLSearchParams(location.search).get("orderId");
  const purchaseTrackedRef = useRef(null);

  useSEO({
    title: "Payment Successful | AARADHYA",
    description:
      "Thank you for shopping with AARADHYA - your payment was successful and your order is confirmed.",
    path: "/shop/payment-success",
  });

  useEffect(() => {
    if (orderId) {
      // Shows the payment information the server verified with PayPal
      dispatch(getOrderDetails(orderId));
    }

    return () => dispatch(resetOrderDetails());
  }, [orderId, dispatch]);

  // GA4 purchase: order id + totals only, no buyer personal data.
  useEffect(() => {
    if (
      orderDetails &&
      purchaseTrackedRef.current !== String(orderDetails._id)
    ) {
      purchaseTrackedRef.current = String(orderDetails._id);
      trackPurchase({
        orderId: orderDetails._id,
        cartItems: orderDetails.cartItems,
        total: orderDetails.totalAmount ?? orderDetails.paidAmount,
      });
    }
  }, [orderDetails]);

  return (
    <Card className="p-10">
      <CardHeader className="p-0">
        <CardTitle className="text-4xl">Payment is successful!</CardTitle>
      </CardHeader>
      <p className="mt-4 text-muted-foreground">
        Thank you! Your payment was verified and your order is confirmed. You can
        find it any time under "My orders".
      </p>

      {orderDetails ? (
        <>
          <Separator className="my-6" />
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label>Order ID</Label>
              <span>{orderDetails?._id}</span>
            </div>
            <div className="flex items-center justify-between">
              <Label>Amount paid</Label>
              <span>
                Rs. {orderDetails?.paidAmount} {orderDetails?.paymentCurrency === "NPR" ? "" : orderDetails?.paymentCurrency}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <Label>Payment status</Label>
              <span>{orderDetails?.paymentStatus}</span>
            </div>
            <div className="flex items-center justify-between">
              <Label>Transaction ID</Label>
              <span>{orderDetails?.transactionId}</span>
            </div>
            {orderDetails?.paymentPayerEmail ? (
              <div className="flex items-center justify-between">
                <Label>Payer account</Label>
                <span>{orderDetails?.paymentPayerEmail}</span>
              </div>
            ) : null}
          </div>
        </>
      ) : null}

      <div className="mt-5 flex gap-3">
        <Button onClick={() => navigate("/shop/account")}>View Orders</Button>
        <Button variant="outline" onClick={() => navigate("/shop/home")}>
          Continue shopping
        </Button>
      </div>
    </Card>
  );
}

export default PaymentSuccessPage;
