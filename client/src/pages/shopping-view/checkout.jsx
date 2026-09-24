
// import Address from "@/components/shopping-view/address";
// import img from "../../assets/hunx.avif";
// import { useDispatch, useSelector } from "react-redux";
// import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { createNewOrder } from "@/store/shop/order-slice";
// import { Navigate } from "react-router-dom";
// import { useToast } from "@/components/ui/use-toast";

// function ShoppingCheckout() {
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const { user } = useSelector((state) => state.auth);
//   const { approvalURL } = useSelector((state) => state.shopOrder);
//   const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
//   const [isPaymentStart, setIsPaymentStart] = useState(false);
//   const dispatch = useDispatch();
//   const { toast } = useToast();

//   console.log(currentSelectedAddress, "cartItems");

//   const totalCartAmount =
//     cartItems && cartItems.items && cartItems.items.length > 0
//       ? cartItems.items.reduce(
//           (sum, currentItem) =>
//             sum +
//             (currentItem?.salePrice > 0
//               ? currentItem?.salePrice
//               : currentItem?.price) *
//               currentItem?.quantity,
//           0
//         )
//       : 0;

//   function handleInitiatePaypalPayment() {
//     if (!cartItems?.items || cartItems.items.length === 0) {
//       toast({
//         title: "Your cart is empty. Please add items to proceed",
//         variant: "destructive",
//       });

//       return;
//     }
//     if (currentSelectedAddress === null) {
//       toast({
//         title: "Please select one address to proceed.",
//         variant: "destructive",
//       });

//       return;
//     }

//     setIsPaymentStart(true);

//     const orderData = {
//       userId: user?.id,
//       cartId: cartItems?._id,
//       cartItems: cartItems.items.map((singleCartItem) => ({
//         productId: singleCartItem?.productId,
//         title: singleCartItem?.title,
//         image: singleCartItem?.image,
//         price:
//           singleCartItem?.salePrice > 0
//             ? singleCartItem?.salePrice
//             : singleCartItem?.price,
//         quantity: singleCartItem?.quantity,
//       })),
//       addressInfo: {
//         addressId: currentSelectedAddress?._id,
//         address: currentSelectedAddress?.address,
//         city: currentSelectedAddress?.city,
//         pincode: currentSelectedAddress?.pincode,
//         phone: currentSelectedAddress?.phone,
//         notes: currentSelectedAddress?.notes,
//       },
//       orderStatus: "pending",
//       paymentMethod: "paypal",
//       paymentStatus: "pending",
//       totalAmount: totalCartAmount,
//       orderDate: new Date(),
//       orderUpdateDate: new Date(),
//       paymentId: "",
//       payerId: "",
//     };

//     dispatch(createNewOrder(orderData));
//   }

//   if (approvalURL && isPaymentStart) {
//     window.location.href = approvalURL;
//     return null;
//   }

//   return (
//     <div className="flex flex-col">
//       <div className="relative h-[300px] w-full overflow-hidden">
//         <img src={img} className="h-full w-full object-cover object-center" />
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
//         <Address
//           selectedId={currentSelectedAddress}
//           setCurrentSelectedAddress={setCurrentSelectedAddress}
//         />
//         <div className="flex flex-col gap-4">
//           {cartItems && cartItems.items && cartItems.items.length > 0
//             ? cartItems.items.map((item) => (
//                 <UserCartItemsContent cartItem={item} key={item.productId} />
//               ))
//             : null}
//           <div className="mt-8 space-y-4">
//             <div className="flex justify-between">
//               <span className="font-bold">Total</span>
//               <span className="font-bold">${totalCartAmount}</span>
//             </div>
//           </div>
//           <div className="mt-4 w-full">
//             <Button onClick={handleInitiatePaypalPayment} className="w-full">
//               {isPaymentStart
//                 ? "Processing Paypal Payment..."
//                 : "Checkout with Paypal"}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ShoppingCheckout;











// import Address from "@/components/shopping-view/address";
// import img from "../../assets/hunx.avif";
// import { useDispatch, useSelector } from "react-redux";
// import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { createNewOrder } from "@/store/shop/order-slice";
// import { useToast } from "@/components/ui/use-toast";

// function ShoppingCheckout() {
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const { user } = useSelector((state) => state.auth);
//   const { approvalURL } = useSelector((state) => state.shopOrder);
//   const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
//   const [isPaymentStart, setIsPaymentStart] = useState(false);
//   const dispatch = useDispatch();
//   const { toast } = useToast();

//   console.log("Selected Address:", currentSelectedAddress);

//   const totalCartAmount =
//     cartItems?.items?.length > 0
//       ? cartItems.items.reduce((sum, currentItem) => {
//           const price =
//             currentItem?.salePrice > 0
//               ? currentItem?.salePrice
//               : currentItem?.price;
//           if (typeof price !== "number" || typeof currentItem?.quantity !== "number") {
//             console.error("Invalid cart item:", currentItem);
//             return sum;
//           }
//           return sum + price * currentItem.quantity;
//         }, 0)
//       : 0;

//   function handleInitiatePaypalPayment() {

//     if (!cartItems?.items?.length) {
//       toast({
//         title: "Your cart is empty. Please add items to proceed",
//         variant: "destructive",
//       });
//       return;
//     }
//     if (!currentSelectedAddress) {
//       toast({
//         title: "Please select one address to proceed.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsPaymentStart(true);

//     const orderData = {
//       userId: user?.id,
//       cartId: cartItems?._id,
//       cartItems: cartItems.items.map((singleCartItem) => ({
//         productId: singleCartItem?.productId,
//         title: singleCartItem?.title,
//         image: singleCartItem?.image,
//         price:
//           singleCartItem?.salePrice > 0
//             ? singleCartItem?.salePrice
//             : singleCartItem?.price,
//         quantity: singleCartItem?.quantity,
//       })),
//       addressInfo: {
//         addressId: currentSelectedAddress?._id,
//         address: currentSelectedAddress?.address,
//         city: currentSelectedAddress?.city,
//         pincode: currentSelectedAddress?.pincode,
//         phone: currentSelectedAddress?.phone,
//         notes: currentSelectedAddress?.notes,
//       },
//       orderStatus: "pending",
//       paymentMethod: "paypal",
//       paymentStatus: "pending",
//       totalAmount: totalCartAmount,
//       orderDate: new Date(),
//       orderUpdateDate: new Date(),
//       paymentId: "",
//       payerId: "",
//     };

//     dispatch(createNewOrder(orderData)).then((result) => {
//       if (createNewOrder.fulfilled.match(result)) {
//         localStorage.setItem("orderId", result.payload.orderId);
//       }
//     });
//   }

//   if (approvalURL && isPaymentStart) {
//     window.location.href = approvalURL;
//     return <div>Redirecting to PayPal...</div>;
//   }

//   return (
//     <div className="flex flex-col">
//       <div className="relative h-[300px] w-full overflow-hidden">
//         <img src={img} className="h-full w-full object-cover object-center" />
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
//         <Address
//           selectedId={currentSelectedAddress}
//           setCurrentSelectedAddress={setCurrentSelectedAddress}
//         />
//         <div className="flex flex-col gap-4">
//           {cartItems?.items?.length > 0
//             ? cartItems.items.map((item) => (
//                 <UserCartItemsContent cartItem={item} key={item.productId} />
//               ))
//             : <p>Your cart is empty.</p>}
//           <div className="mt-8 space-y-4">
//             <div className="flex justify-between">
//               <span className="font-bold">Total</span>
//               <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
//             </div>
//           </div>
//           <div className="mt-4 w-full">
//             <Button
//               onClick={handleInitiatePaypalPayment}
//               className="w-full"
//               disabled={isPaymentStart}
//             >
//               {isPaymentStart
//                 ? "Processing Paypal Payment..."
//                 : "Checkout with Paypal"}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ShoppingCheckout;





import Address from "@/components/shopping-view/address";
import img from "../../assets/hunx.avif";

import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSEO } from "@/components/common/seo";
import { trackBeginCheckout } from "@/lib/analytics";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useSEO({
    title: "Checkout | AARADHYA",
    description:
      "Complete your AARADHYA purchase securely - review your cart, choose a delivery address and pay with eSewa.",
    path: "/shop/checkout",
  });

  // GA4 begin_checkout: fired when the cart content on the checkout page
  // changes. Only product/price/quantity data is sent, never addresses.
  const cartSignature = (cartItems?.items || [])
    .map((item) => `${item.productId}:${item.quantity}`)
    .join("|");
  useEffect(() => {
    if (cartItems?.items?.length > 0) {
      trackBeginCheckout(cartItems.items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartSignature]);

  console.log(currentSelectedAddress, "cartItems");

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleInitiateEsewaPayment() {
    if (!cartItems?.items || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });

      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });

      return;
    }

    // Only the cart and the delivery address are sent. Prices, stock, totals, the
    // order status and every payment value are decided by the server.
    const orderData = {
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
    };

    setIsPaymemntStart(true);

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        // Mock gateway runs inside the app (no real URL); eSewa mode posts
        // the signed form straight to the payment page.
        if (data.payload.mockMode && data.payload.orderId) {
          window.location.href = `/shop/mock-gateway?orderId=${data.payload.orderId}`;
        } else {
          submitEsewaForm(data.payload);
        }
      } else {
        setIsPaymemntStart(false);
        // e.g. "Only 3 left in stock for <product>" returned by the server
        toast({
          title: data?.payload?.message || "Unable to place the order",
          variant: "destructive",
        });
      }
    });
  }

  // eSewa works with a signed HTML form: the server signs the server-side
  // total and the browser posts it straight to eSewa.
  function submitEsewaForm(payload) {
    if (!payload?.esewaUrl || !payload?.esewaParams) {
      setIsPaymemntStart(false);
      toast({
        title: "The eSewa payment could not be prepared",
        variant: "destructive",
      });
      return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = payload.esewaUrl;

    Object.entries(payload.esewaParams).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value ?? "";
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  }

  return (
    <div className="flex flex-col page-sheen">
      <div className="relative h-[260px] w-full overflow-hidden">
        <img
          src={img}
          alt="AARADHYA checkout banner - complete your purchase"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2b0f1e]/80 via-[#2b0f1e]/40 to-transparent" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-center px-4 md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
            Almost Yours
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-white md:text-5xl">
            Checkout
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent cartItem={item} key={item.productId} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">Rs. {totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button
              onClick={handleInitiateEsewaPayment}
              className="w-full"
              disabled={isPaymentStart}
            >
              {isPaymentStart
                ? "Redirecting to eSewa..."
                : "Pay with eSewa"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;