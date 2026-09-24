import CommonForm from "@/components/common/form";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { adFormElements } from "@/config";
import {
  addNewAdvertisement,
  deleteAdvertisement,
  editAdvertisement,
  fetchAllAdvertisements,
} from "@/store/admin/ads-slice";
import { ExternalLink, Megaphone } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  title: "",
  image: null,
  linkUrl: "",
  placement: "home-strip",
  isActive: true,
  startsAt: "",
  endsAt: "",
};

function AdminAdvertisements() {
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { adList } = useSelector((state) => state.adminAds);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAllAdvertisements());
  }, [dispatch]);

  function onSubmit(event) {
    event.preventDefault();
    if (!uploadedImageUrl) {
      toast({
        title: "Error",
        description: "Please upload a banner image first",
        variant: "destructive",
      });
      return;
    }
    if (!formData.title || !formData.linkUrl) {
      toast({
        title: "Error",
        description: "Please fill in the title and link URL",
        variant: "destructive",
      });
      return;
    }

    const payload = { ...formData, image: uploadedImageUrl };

    if (currentEditedId !== null) {
      dispatch(editAdvertisement({ id: currentEditedId, formData: payload })).then(
        (data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAdvertisements());
            setFormData(initialFormData);
            setUploadedImageUrl("");
            setOpenDialog(false);
            setCurrentEditedId(null);
            toast({ title: "Advertisement updated successfully" });
          } else {
            toast({
              title: data?.payload?.message || "Unable to update the advertisement",
              variant: "destructive",
            });
          }
        }
      );
    } else {
      dispatch(addNewAdvertisement(payload)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAdvertisements());
          setOpenDialog(false);
          setImageFile(null);
          setFormData(initialFormData);
          setUploadedImageUrl("");
          toast({ title: "Advertisement added successfully" });
        } else {
          toast({
            title: data?.payload?.message || "Unable to add the advertisement",
            variant: "destructive",
          });
        }
      });
    }
  }

  function handleDelete(id) {
    dispatch(deleteAdvertisement(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAdvertisements());
      }
    });
  }

  function handleEdit(ad) {
    setCurrentEditedId(ad._id);
    setFormData({
      title: ad.title || "",
      image: ad.image || null,
      linkUrl: ad.linkUrl || "",
      placement: ad.placement || "home-strip",
      isActive: ad.isActive !== false,
      startsAt: ad.startsAt ? String(ad.startsAt).slice(0, 10) : "",
      endsAt: ad.endsAt ? String(ad.endsAt).slice(0, 10) : "",
    });
    setUploadedImageUrl(ad.image || "");
    setOpenDialog(true);
  }

  return (
    <Fragment>
      <div className="mb-5 flex w-full items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Advertisements</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paid display banners shown on the storefront by placement.
          </p>
        </div>
        <Button
          onClick={() => {
            setOpenDialog(true);
            setCurrentEditedId(null);
            setFormData(initialFormData);
            setUploadedImageUrl("");
          }}
        >
          Add Advertisement
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adList && adList.length > 0
          ? adList.map((ad) => (
              <Card key={ad._id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="h-44 w-full object-cover"
                  />
                  <div className="absolute left-3 top-3 flex gap-2">
                    <Badge className="rounded-full bg-gold text-[#2b0f1e] hover:bg-gold">
                      Ad
                    </Badge>
                    {ad.isActive ? (
                      <Badge className="rounded-full bg-green-600">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Paused</Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h2 className="truncate font-display text-lg font-semibold">
                    {ad.title}
                  </h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gold">
                    {ad.placement}
                  </p>
                  <a
                    href={ad.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-1 truncate text-sm text-muted-foreground hover:text-primary"
                  >
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    {ad.linkUrl}
                  </a>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {ad.clicks || 0} clicks
                    {ad.startsAt || ad.endsAt
                      ? ` · ${ad.startsAt ? String(ad.startsAt).slice(0, 10) : "…"} → ${
                          ad.endsAt ? String(ad.endsAt).slice(0, 10) : "…"
                        }`
                      : " · always on"}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button onClick={() => handleEdit(ad)}>Edit</Button>
                  <Button onClick={() => handleDelete(ad._id)} variant="destructive">
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))
          : null}
      </div>

      {(!adList || adList.length === 0) && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-16 text-center">
          <Megaphone className="h-8 w-8 text-muted-foreground" />
          <p className="font-medium">No advertisements yet</p>
          <p className="text-sm text-muted-foreground">
            Add a paid banner to show it on the storefront.
          </p>
        </div>
      )}

      <Sheet
        open={openDialog}
        onOpenChange={() => {
          setOpenDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setUploadedImageUrl("");
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Advertisement" : "Add Advertisement"}
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
              formControls={adFormElements}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              onSubmit={onSubmit}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminAdvertisements;
