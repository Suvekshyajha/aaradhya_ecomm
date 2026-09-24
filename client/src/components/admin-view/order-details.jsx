// import { useState } from "react";
// import CommonForm from "../common/form";
// import { DialogContent } from "../ui/dialog";
// import { Label } from "../ui/label";
// import { Separator } from "../ui/separator";





// const  initialFormData ={
//   status: ''
// }




// function AdminOrderDetailsView(){

//   const [formData, setFormData] = useState(initialFormData)

//   function handleUpdateStatus(event){
//     event.preventDefault()
//   }
//   return(
// <DialogContent className="sm:max-w-[600px]">
//   <div className=" grid gap-6">
//     <div className="grid gap-2">
//       <div className="flex mt-6 items-center justify-between">
//         <p className="font-medium">Order ID</p>
//         <Label>456789</Label>
//       </div>

//       <div className="flex mt-2 items-center justify-between">
//         <p className="font-medium">Order Date</p>
//         <Label>27/06/2025</Label>
//       </div>

//       <div className="flex mt-2 items-center justify-between">
//         <p className="font-medium">Status</p>
//         <Label>In Process</Label>
//       </div>


//       <div className="flex mt-2 items-center justify-between">
//         <p className="font-medium">Price</p>
//         <Label>Rs.207656 </Label>
//       </div>

//     </div>

//     <Separator/>
// <div className="grid gap-4">
//   <div className="grid gap-2">
//     <div className="font-medium">
//       Order details
//     </div>
//     <ul className="grid gap-3">
//       <li className="flex items-center justify-between">
//         <span>Product One</span>
//         <span>Rs. 207656</span>
//       </li>
//     </ul>

//   </div>
// </div>
//   </div>



//   <div className="grid gap-4">
//   <div className="grid gap-2">
//     <div className="font-medium">
//    Shipping Info
//     </div>
//     <ul className="grid gap-3">
//       <div className="grid gap-o.5 text-muted-foreground">
//         <span>Alisha Bohara</span>
//         <span>City</span>
//         <span>Address</span>
//         <span>Pincodes</span>
//         <span>Phone</span>
//         <span>Notes</span>

//         </div>
      
//     </ul>
    

//   </div>
// </div>


// <div>
//   <CommonForm
//   formControls={[
//     {
//       label: "Oder Status",
//       name: "Status",
//       componentType: "select",
//       options: [
//         { id: "pending", label: "Pending" },
//         { id: "inProcess", label: "In Process" },
//         { id: "inShipping", label: "In Shipping" },
//         { id: "delivered", label: "Deliverd" },
//         { id: "rejected", label: "Rejected" },
        
//       ],
//     },
//   ]}
//   formData={formData}
//   setFormData={setFormData}
//   buttonText={'Update Order Status'}
//   onSubmit={handleUpdateStatus}
  
//   />
// </div>

// </DialogContent>
//   )

// }
// export default AdminOrderDetailsView;




import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";

const initialFormData = {
  status: "",
};

function formatOrderDate(value) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime()))
    return String(value).split("T")[0] || "—";
  return date.toISOString().split("T")[0];
}

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(orderDetails, "orderDetailsorderDetails");

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      } else {
        // e.g. "Order status was not changed: only 2 left in stock for <product>"
        toast({
          title: data?.payload?.message || "Unable to update the order status",
          variant: "destructive",
        });
      }
    });
  }

  // Never render blank rows: the parent fetches details asynchronously,
  // so show a loading state until the order arrives.
  if (!orderDetails) {
    return (
      <DialogContent className="sm:max-w-[600px]">
        <p className="py-10 text-center text-muted-foreground">
          Loading order details…
        </p>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails._id || "—"}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{formatOrderDate(orderDetails.orderDate)}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>Rs. {orderDetails.totalAmount ?? "—"}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment method</p>
            <Label>{orderDetails.paymentMethod || "—"}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails.paymentStatus || "—"}</Label>
          </div>
          {orderDetails.transactionId ? (
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Transaction ID</p>
              <Label>{orderDetails.transactionId}</Label>
            </div>
          ) : null}
          {orderDetails.paidAmount != null ? (
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Amount paid</p>
              <Label>Rs. {orderDetails.paidAmount}</Label>
            </div>
          ) : null}
          {orderDetails.paymentFailureReason ? (
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Payment note</p>
              <Label className="text-red-600">
                {orderDetails.paymentFailureReason}
              </Label>
            </div>
          ) : null}
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails.orderStatus === "rejected" ||
                      orderDetails.orderStatus === "cancelled"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {orderDetails.orderStatus || "—"}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails.cartItems && orderDetails.cartItems.length > 0 ? (
                orderDetails.cartItems.map((item) => (
                  <li
                    key={item.productId || item.title}
                    className="flex items-center justify-between gap-2"
                  >
                    <span>
                      {item.title} × {item.quantity}
                    </span>
                    <span>Rs. {item.price}</span>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground">No items found.</li>
              )}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user?.userName || "—"}</span>
              <span>{orderDetails.addressInfo?.address || "—"}</span>
              <span>{orderDetails.addressInfo?.city || "—"}</span>
              <span>{orderDetails.addressInfo?.pincode || "—"}</span>
              <span>{orderDetails.addressInfo?.phone || "—"}</span>
              {orderDetails.addressInfo?.notes ? (
                <span>{orderDetails.addressInfo.notes}</span>
              ) : null}
            </div>
          </div>
        </div>

        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "cancelled", label: "Cancelled (stock is restored)" },
                  { id: "rejected", label: "Rejected (stock is restored)" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;