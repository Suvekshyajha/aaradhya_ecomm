import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { verifyEsewaPayment } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function EsewaSuccessPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [message, setMessage] = useState("Verifying payment... Please wait!");
  const [isFailed, setIsFailed] = useState(false);

  const params = new URLSearchParams(location.search);

  // eSewa appends the signed base64 payload as `data`; the order id travels
  // in the success url the server generated, with session as fallback
  const data = params.get("data");
  const orderId =
    params.get("orderId") ||
    JSON.parse(sessionStorage.getItem("currentOrderId") || "null");

  // toast is intentionally not a dependency - the effect must run once per payment
  useEffect(() => {
    if (!data || !orderId) {
      setIsFailed(true);
      setMessage(
        "The payment information is incomplete, so the order could not be confirmed. Please contact support if money was taken."
      );
      return;
    }

    // The server verifies the signature and the transaction with eSewa
    // before it confirms the order
    dispatch(verifyEsewaPayment({ orderId, data })).then((result) => {
      if (result?.payload?.success) {
        sessionStorage.removeItem("currentOrderId");
        navigate(`/shop/payment-success?orderId=${orderId}`);
      } else {
        setIsFailed(true);
        setMessage(result?.payload?.message || "Payment could not be confirmed");
        toast({
          title: result?.payload?.message || "Payment could not be confirmed",
          variant: "destructive",
        });
      }
    });
  }, [data, orderId, dispatch, navigate]);

  return (
    <Card className="p-10">
      <CardHeader className="p-0">
        <CardTitle className="text-3xl">{message}</CardTitle>
      </CardHeader>
      {isFailed ? (
        <div className="mt-5 flex gap-3">
          <Button onClick={() => navigate("/shop/checkout")}>
            Back to checkout
          </Button>
          <Button variant="outline" onClick={() => navigate("/shop/account")}>
            My orders
          </Button>
        </div>
      ) : null}
    </Card>
  );
}

export default EsewaSuccessPage;
