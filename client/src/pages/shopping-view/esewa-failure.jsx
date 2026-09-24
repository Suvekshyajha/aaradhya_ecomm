import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { cancelPayment } from "@/store/shop/order-slice";

function EsewaFailurePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(true);

  // eSewa redirects the buyer here (failure_url) when the payment was not completed
  const orderId =
    new URLSearchParams(location.search).get("orderId") ||
    JSON.parse(sessionStorage.getItem("currentOrderId") || "null");

  // toast is intentionally not a dependency - the effect must run once per order
  useEffect(() => {
    if (!orderId) {
      setIsRecording(false);
      return;
    }

    // The server marks the order and its payment as cancelled
    dispatch(cancelPayment({ orderId })).then((data) => {
      setIsRecording(false);
      sessionStorage.removeItem("currentOrderId");

      if (!data?.payload?.success) {
        toast({
          title: data?.payload?.message || "The payment could not be cancelled",
          variant: "destructive",
        });
      }
    });
  }, [orderId, dispatch]);

  return (
    <Card className="p-10">
      <CardHeader className="p-0">
        <CardTitle className="text-4xl">Payment failed</CardTitle>
      </CardHeader>
      <p className="mt-4 text-muted-foreground">
        Your eSewa payment was not completed, so nothing was charged and no
        order was confirmed. The items are still in your cart.
      </p>
      {isRecording ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Updating your order...
        </p>
      ) : null}
      <div className="mt-5 flex gap-3">
        <Button onClick={() => navigate("/shop/checkout")}>
          Back to checkout
        </Button>
        <Button variant="outline" onClick={() => navigate("/shop/home")}>
          Continue shopping
        </Button>
      </div>
    </Card>
  );
}

export default EsewaFailurePage;
