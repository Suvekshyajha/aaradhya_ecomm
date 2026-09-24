import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  cancelPayment,
  getOrderDetails,
  mockConfirmEsewaPayment,
} from "@/store/shop/order-slice";
import { Loader2, ShieldCheck, Wallet } from "lucide-react";

/**
 * Built-in test gateway (used when the backend runs ESEWA_MODE=mock, so no
 * real payment URL is ever needed). Mimics the eSewa cashier: the buyer
 * reviews the server-side total and pays or cancels. Paying asks the server
 * for a signed payload that travels the exact same verify path as a real
 * eSewa response.
 */
function MockGatewayPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { orderDetails } = useSelector((state) => state.shopOrder);
  const [isPaying, setIsPaying] = useState(false);

  const orderId = new URLSearchParams(location.search).get("orderId");

  useEffect(() => {
    if (orderId) dispatch(getOrderDetails(orderId));
  }, [orderId, dispatch]);

  function handlePay() {
    if (!orderId) return;
    setIsPaying(true);
    dispatch(mockConfirmEsewaPayment({ orderId })).then((result) => {
      setIsPaying(false);
      if (result?.payload?.success && result?.payload?.data) {
        const data = encodeURIComponent(result.payload.data);
        navigate(`/shop/esewa-success?orderId=${orderId}&data=${data}`);
      } else {
        toast({
          title: result?.payload?.message || "Mock payment failed",
          variant: "destructive",
        });
      }
    });
  }

  function handleCancel() {
    if (!orderId) {
      navigate("/shop/checkout");
      return;
    }
    dispatch(cancelPayment({ orderId })).finally(() => {
      navigate(`/shop/esewa-failure?orderId=${orderId}`);
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col px-4 py-10">
      <Card className="overflow-hidden">
        <div className="bg-[#60bb46] px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            <CardTitle className="text-xl">Test Gateway</CardTitle>
          </div>
          <p className="mt-1 text-sm text-white/80">
            Mock cashier for development — no real money moves.
          </p>
        </div>
        <CardHeader>
          <p className="text-sm text-muted-foreground">Paying merchant order</p>
          <p className="break-all font-mono text-xs">{orderId || "…"}</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3">
            <span className="font-medium">Total amount</span>
            <span className="font-display text-2xl font-bold text-primary">
              Rs. {orderDetails?.totalAmount ?? "…"}
            </span>
          </div>
          <Separator className="my-4" />
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
            The signed response travels the same server verification
            (signature, order binding, amount match) as a live payment.
          </p>
          <div className="mt-5 flex gap-3">
            <Button
              className="flex-1 rounded-full bg-[#60bb46] py-6 hover:bg-[#4da237]"
              disabled={isPaying || !orderId}
              onClick={handlePay}
            >
              {isPaying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Pay Now"
              )}
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-full py-6"
              disabled={isPaying}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MockGatewayPage;
