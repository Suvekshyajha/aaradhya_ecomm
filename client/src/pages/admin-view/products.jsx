import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
  isSponsored: false,
  sponsorName: "",
  sponsoredUntil: "",
  affiliateUrl: "",
  affiliatePartner: "",
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    if (!uploadedImageUrl) {
      toast({
        title: "Error",
        description: "Please upload an image first",
        variant: "destructive"
      });
      return;
    }
    const requiredFields = [
      'title', 'description', 'category', 
      'brand', 'price', 'totalStock'
    ];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      toast({
        title: "Error",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData: {
              ...formData,
              image: uploadedImageUrl
            },
          })
        ).then((data) => {
          console.log(data, "edit");

          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({
              title: "Product add successfully",
            });
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    const requiredFields = [
      'title', 'description', 'category', 
      'brand', 'price', 'totalStock'
    ];
    const isAllFieldsFilled = requiredFields.every(field => 
      formData[field] !== null && 
      formData[field] !== undefined && 
      formData[field].toString().trim() !== ''
    );
    const isImageUploaded = !!uploadedImageUrl;
    // console.log("Form Fields Validation:", {
    //   formData,
    //   isAllFieldsFilled,
    //   isImageUploaded
    // });

    // return Object.keys(formData)
    //   .filter((currentKey) => currentKey !== "averageReview")
    //   .map((key) => formData[key] !== "")
    //   .every((item) => item);
    return isAllFieldsFilled && isImageUploaded;
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);
  useEffect(() => {
    if (currentEditedId !== null && formData.image) {
      setUploadedImageUrl(formData.image);
    }
  }, [currentEditedId, formData.image]);
  console.log(formData, "productList");

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end ">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 ">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
              
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto bg-white">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;