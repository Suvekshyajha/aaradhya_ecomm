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

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>Rs. ${orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected" ||
                      orderDetails?.orderStatus === "cancelled"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li className="flex items-center justify-between">
                      <span>Title: {item.title}</span>
                      <span>Quantity: {item.quantity}</span>
                      <span>Price: Rs. ${item.price}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
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