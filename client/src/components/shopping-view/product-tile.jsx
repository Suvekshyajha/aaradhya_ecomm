import { brandOptionsMap, categoryOptionsMap } from "@/config"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter } from "../ui/card"
import { ShoppingBag } from "lucide-react"

function ShoppingProductTile({
    product,
    handleGetProductDetails,
    handleAddtoCart

}){
    return(
   <Card className="group w-full max-w-sm mx-auto overflow-hidden border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10">

    <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
        <div className="relative overflow-hidden">
            <img
            src={product?.image}
            alt={product?.title}
            loading="lazy"
            className="w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {
                product?.salePrice > 0 ?
                <Badge className="absolute top-3 left-3 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2b0f1e] hover:bg-gold">
                    Sale
                </Badge>: null
            }

            {
                product?.isSponsored ?
                <Badge className="absolute bottom-3 left-3 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-foreground">
                    Sponsored
                </Badge>: null
            }

            {
                product?.totalStock === 0 ?
                <Badge className="absolute top-3 right-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    Sold out
                </Badge>: null
            }

        </div>

        <CardContent className="p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold">
            {brandOptionsMap[product?.brand] ?? "AARADHYA"}
        </p>
        <h2 className="mt-1 truncate font-display text-xl font-semibold leading-snug">{product?.title}</h2>

        <div className="mt-1 flex justify-between items-center mb-3">
            <span className="text-[13px] text-muted-foreground">
                 {categoryOptionsMap[product?.category] ?? "Unknown Category"}

            </span>
        </div>


        <div className="flex justify-start items-baseline gap-2 mb-1">
            {
                product?.salePrice > 0 ?
                <span className="text-lg font-semibold text-primary">
                Rs. {product?.salePrice}
                </span>
                : null
            }

            <span  className={`${
                product?.salePrice > 0 ? "line-through text-muted-foreground text-sm font-normal" : "text-lg font-semibold text-primary"
              }`}>
                 Rs. {product?.price}
            </span>


        </div>

        </CardContent>

    </div>
    <CardFooter className="px-5 pb-5 pt-0">
            <Button
              onClick={()=>handleAddtoCart(product?._id, product?.totalStock)}
              className='w-full rounded-full py-5 text-[13px] font-semibold uppercase tracking-[0.14em]'
              disabled={product?.totalStock === 0}
            >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {product?.totalStock === 0 ? "Sold Out" : "Add to Cart"}
            </Button>
        </CardFooter>

   </Card>
    )
}

export default ShoppingProductTile
