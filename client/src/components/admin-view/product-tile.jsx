// import { Button } from "../ui/button";
// import { Card, CardContent, CardFooter } from "../ui/card";

// function AdminProductTile({
//   product,
//   setFormData,
//   setOpenCreateProductsDialog,
//   setCurrentEditedId,
//   handleDelete,
// }) {
//   return (
//     <Card className="w-full max-w-sm mx-auto">
//       <div>
//         <div className="relative">
//           <img
//             src={product?.image}
//             alt={product?.title}
//             className="w-full h-[300px] object-cover rounded-t-lg"
//           />
//         </div>
//         <CardContent>
//           <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
//           <div className="flex justify-between items-center mb-2">
//             <span
//               className={`${
//                 product?.salePrice > 0 ? "line-through" : ""
//               } text-lg font-semibold text-primary`}
//             >
//               ${product?.price}
//             </span>
//             {product?.salePrice > 0 ? (
//               <span className="text-lg font-bold">${product?.salePrice}</span>
//             ) : null}
//           </div>
//         </CardContent>
//         <CardFooter className="flex justify-between items-center">
//           <Button
//             onClick={() => {
//               setOpenCreateProductsDialog(true);
//               setCurrentEditedId(product?._id);
//               setFormData(product);
//             }}
//           >
//             Edit
//           </Button>
//           <Button onClick={() => handleDelete(product?._id)}>Delete</Button>
//         </CardFooter>
//       </div>
//     </Card>
//   );
// }

// export default AdminProductTile;










import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({ 
  product, 
  setFormData, 
  setOpenCreateProductsDialog, 
  setCurrentEditedId, 
  handleDelete 
}) {
  // Destructure product for cleaner code
  const { _id, image, title, price, salePrice, isSponsored, sponsorName } = product || {};

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        {/* Product Image */}
        <div className="relative">
          <img
            src={image || "/placeholder.jpg"} // Fallback if no image
            alt={title || "Product image"}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {isSponsored ? (
            <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2b0f1e]">
              Sponsored{sponsorName ? ` · ${sponsorName}` : ""}
            </span>
          ) : null}
        </div>

        <CardContent>
          {/* Product Title */}
          <h2 className="text-xl font-bold mb-2 mt-2">{title || "No Title"}</h2>

          {/* Pricing Section */}
          <div className="flex justify-between items-center mb-2">
            <span className={`${salePrice > 0 ? "line-through" : ""} text-lg font-semibold text-primary`}>
              Rs. ${price ?? "N/A"}
            </span>
            {salePrice > 0 && <span className="text-lg font-bold">Rs. ${salePrice}</span>}
          </div>
        </CardContent>

        {/* Actions (Edit & Delete Buttons) */}
        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={() => {
              setOpenCreateProductsDialog?.(true);
              setCurrentEditedId?.(_id);
              setFormData?.(product);
            }}
          >
            Edit
          </Button>
          <Button onClick={() => handleDelete?.(_id)} variant="destructive">
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
