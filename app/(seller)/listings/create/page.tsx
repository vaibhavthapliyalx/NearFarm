/**
 * @fileoverview This file contains the product add page.
 * This page is used to add a new product to the platform.
 * It is only accessible to farmers.
 */

// Directive to use client side rendering.
"use client";

// Imports.
import { useForm } from "react-hook-form";
import { ChangeEvent, useEffect, useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUploadThing } from "@/lib/uploadthing";
import { classMerge, isBase64Image } from "@/lib/utilityfunctions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCategory, ToastType, UserRole } from "@/shared/constants";
import {  Product, User } from "@/shared/interfaces";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ApiConnector from "@/app/services/ApiConnector";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/LoadingAnimations/LoadingSpinner";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import CarouselRenderer from "@/components/CarouselRenderer";
import { Card, CardContent } from "@/components/ui/card";
import { productValidation } from "@/lib/validations/product.validation";
import { useRouter } from "next/navigation";
import axios from "axios";

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();


export default function AddProduct() {
  // Starts the upload process for the product catalogue.
  // This is done using the useUploadThing hook in the uploadthing module.
  // The catalogueUploader is the name of the module defined in /api/uploadthing/core.ts
  const { startUpload } = useUploadThing("catalogueUploader");
  const [seller, setSeller] = useState<User | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  let edit: string | null = null;
  let listingId: string | null = null;
  let inEditMode = false;

  // Grabs the toast function from the useToast hook.
  const {toast} = useToast();
  const router = useRouter();

  // Creates a form using the useForm hook from react-hook-form.
  const form = useForm<z.infer<typeof productValidation>>({
    resolver: zodResolver(productValidation),
    defaultValues: {
      name: "",
      description: "Fresh from the farm",
      availableFrom: new Date(),
      collectionAddress: seller?.contactDetails.address || "",
      category: ProductCategory.ALL,
      notes: "This product is fresh from the farm.",
    },
  });

  // On component mount, fetch the seller's data from the server.
  useEffect(() => {
    // Grabs the query parameters from the URL.
    const queryParams = new URLSearchParams(window.location.search);
    edit = queryParams.get("edit");
    listingId = queryParams.get("product_id");
    inEditMode = (edit === "true" && listingId !== null) ? true : false;

    async function fetchSellerData() {
      const seller = await apiConnectorInstance.getCurrentUserFromSession();
      // Fetch the seller's data from the server.
      const res = await apiConnectorInstance.getUserFromId(seller.id);
      if (res.success) {
        // Set the seller's data.
        setSeller(res.data);
      } else {
        // If the request fails, set the seller's data to null.
        setSeller(null);
      }
    }
    // Fetch the seller's data.
    fetchSellerData();

    // Cleanup function.
    return function cleanup() {
      setSeller(null);
    }
  }, []);

  // This useEffect hook is used to fetch the product data when the page is in edit mode.
  // This will pre-fill the form with the existing product data.
  // This is done by fetching the product data from the server using the listingId.
  // The listingId is passed as a query parameter in the URL when the user clicks on the edit button.
  useEffect(() => {
    if (!inEditMode) {
      return;
    }
    async function fetchProductData() {
      const res = await apiConnectorInstance.getProducts({ id: listingId as string});
      if (res.success) {
        const product = res.data[0];

        // Check if product has catalogue. If not we set catalogue to its image.
        if (!product.catalogue || product.catalogue.length === 0) {
          product.catalogue = [product.image];
        }
        form.setValue("name", product.name);
        form.setValue("description", product.description);
        form.setValue("salePrice", product.salePrice.toString());
        form.setValue("marketPrice", product.marketPrice.toString());
        form.setValue("quantity", product.quantity.toString());

        // Now we pre-fetch the images and set them to the form value.
        // This is done by converting the image urls to image files.
        // This is done to ensure that the images are displayed in the form.
        const imageFiles = await Promise.all(product.catalogue.map(async (url:string) => {
          const response = await axios.get(url, { responseType: 'blob' });
          const blob = response.data;
          return new File([blob], url.split('/').pop() || 'image.jpg', { type: blob.type });
        }));
        // Set the image files to the form value.
        setFiles(imageFiles);
        form.setValue("images", product.catalogue);
        form.setValue("availableFrom", new Date(product.availableFrom as string));
        form.setValue("collectionAddress", product.collectionAddress);
        form.setValue("category", product.category);
        form.setValue("notes", product.notes);
      }
    }
    fetchProductData();
  }, [edit, listingId]);

  /**
   * This function is responsible for uploading the images to the server.
   * 
   * @param files  The files to upload.
   * @param values  The form values.
   */
  async function uploadImage(files: File[], values: any) {
    const imgRes = await startUpload(files);
    if (imgRes && imgRes.length > 0) {
      values.images = imgRes.map((res) => res.url);
      console.log(values.images);
    }
    if (!imgRes) {
      toast({
        title: "Error",
        description: "Failed to upload images. Please try again.",
        variant: ToastType.DESTRUCTIVE,
      });
      setIsLoading(false);
      setMessage("");
    }
  }

  /**
   * This function is called when the seller submits the form.
   * 
   * @param {any} values The form values.
   * @returns void
   */
  async function onSubmit(values: any) {
    setMessage("Listing your product now...");
    setIsLoading(true);
    const blob = values.images;
    let hasImageChanged = false;
    blob.forEach((image: string) => {
    hasImageChanged = isBase64Image(image);
    });

    // We return an error if user tries to submit the form without uploading an image.
    if (!hasImageChanged && !inEditMode) {
      toast({
        title: "Error",
        description: "Please upload an image.",
        variant: ToastType.DESTRUCTIVE,
      });
      setIsLoading(false);
      setMessage("");
    }

    // We upload the image only if the image has changed.
    // This is done to prevent unnecessary image uploads and redundant image processing.
    if (hasImageChanged) {
      await uploadImage(files, values);
    }
    // Package the product data.
    const productData: Product = {
      id: listingId as string,
      name: values.name,
      description: values.description,
      salePrice: parseFloat(values.salePrice),
      marketPrice: parseFloat(values.marketPrice),
      quantity: parseInt(values.quantity),
      image: values.images[0],
      catalogue: values.images,
      availableFrom: values.availableFrom,
      collectionAddress: values.collectionAddress,
      category: values.category,
      notes: values.notes,
      sellerId: seller?.id as string,
      rating: 5,
      soldTillDate: 0
    };

    // If the page is in edit mode, update the product instead of listing it.
    if (inEditMode) {
      const res = await apiConnectorInstance.updateProduct(productData);
      console.log(res);
      setIsLoading(false);
      setMessage("");
      if (!res.success) {
        toast({
          title: "Error",
          description: res.message,
          variant: ToastType.DESTRUCTIVE,
        });
        return;
      } else {
        router.replace("/listings");
      }
    }

    // Add the product to the database.
    const res = await apiConnectorInstance.listProduct(productData);
    setIsLoading(false);
    setMessage("");

    // If the product is not added successfully, show an error message.
    if (!res.success) {
      toast({
        title: "Error",
        description: res.message,
        variant: ToastType.DESTRUCTIVE,
      });
      return; 
    } else {
      // On successful addition of the product, redirect the user back to product page.
      // Here we use replace instead of push to prevent the user from listing same product multiple times.
      router.replace("/listings");
    }
  }

  /**
   * This function is called when the user selects an image to upload.
   * Implementations include previewing the image and changing the field value.
   * 
   * @param e The change event.
   * @param fieldChange The function to change the field value.
   * @returns void 
   */
  function handleImagesUpload(e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string[]) => void) {
    e.preventDefault();
    setMessage("Optimizing images for upload...");
    setIsLoading(true);
    
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      console.log(selectedFiles);
      
      const urls: string[] = [];
      selectedFiles.forEach((file) => {
        const fileReader = new FileReader();
        if (!file.type.includes("image")) {
          return;
        }
        fileReader.onload = async (event) => {
          const imageDataUrl = event.target?.result?.toString() || "";
          if (!imageDataUrl) {
            toast({
              title: "Error",
              description: "Failed to read image data.",
              variant: ToastType.DESTRUCTIVE,
            });
            return;
          }
          const res = await apiConnectorInstance.applyPreProcessingToImage(imageDataUrl, 200, 200);
          if (!res.success) {
            toast({
              title: "Error",
              description: res.message,
              variant: ToastType.DESTRUCTIVE,
            });
            return;
          } else {
            toast({
              title: "Success",
              description: res.message,
              variant: ToastType.SUCCESS,
            });
            setIsLoading(false);
            setMessage("");
          }
          const response = res.data;
          // Now convert the processed image buffer to an image url.
          const processedImgUrl = `data:${file.type};base64,${response}`;
          // We add the processed image url to the urls array.
          urls.push(processedImgUrl);

          if (urls.length === selectedFiles.length) {
            fieldChange(urls);
          }
        };
        fileReader.readAsDataURL(file);
      });
    }
  };

  /***************************** Render Function *****************************/
  return (
    <MaxWidthWrapper>
      <div className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
      <p className='mt-3 text-base-regular text-light-2'>
        Fill in the product details below to add a new product to the platform.
      </p>
      <div className='mt-9  p-10'>
      <LoadingSpinner display={isLoading} message={message}/>
      <Form {...form}>
        <form
          className='flex flex-col justify-start gap-10'
          onSubmit={form.handleSubmit(onSubmit)}
          onError={(errors) => console.log(errors)}
        >
          <FormField
            control={form.control}
            name='images'
            render={({ field }) => (
              <FormItem className='flex flex-col items-center gap-4'>
                <FormLabel className='flex h-60 mb-6 sm:h-72 md:h-96 lg:h-120 xl:h-144 2xl:h-160 w-60 sm:w-72 md:w-96 lg:w-120 items-center justify-center bg-dark-4'>
                  <div className="w-full h-4 bg-dark-4 flex items-center justify-center">
                    {field.value ? (
                      <CarouselRenderer 
                        className="rounded-lg dark:border-gray-800 border border-gray-200 max-h-80" 
                        images={files.map((file) => {
                          return URL.createObjectURL(file);
                        })}
                        imageWidth={500} 
                        imageHeight={200} 
                      />
                    ) : (
                      <Card className="flex items-center justify-center w-80 h-80 bg-inherit">
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <div>
                            <p className="text-center text-gray-500">
                              Add images of your product here.
                            </p>
                            <div className="text-center text-gray-500 mt-4">
                              Max file count: 10
                            </div>
                            <div className="text-center text-gray-500 mt-4">
                              Max file size: 4MB for images and 32MB for videos
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </FormLabel>
                <FormControl className='flex-1 ml-16 mt-10 text-base-semibold text-gray-200'>
                  <Input
                    multiple 
                    type='file'
                    accept='image/*'
                    placeholder='Add profile photo'
                    className='cursor-pointer border-none bg-transparent outline-none file:text-blue'
                    onChange={(e) => handleImagesUpload(e, field.onChange)}
                  />
                  
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-light-2'>
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    className='border border-dark-4 text-light-1'
                    autoCapitalize="words"
                    autoSave="name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-light-2'>
                  Bio
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={10}
                    className='border border-dark-4 text-light-1 '
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is a short description of your product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='salePrice'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-light-2'>
                  Sale Price
                </FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <span className="mr-2">£</span>
                    <Input
                      type='number'
                      min='0.01'
                      step='any'
                      className='border border-dark-4 text-light-1'
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='marketPrice'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-light-2'>
                  Market Price
                </FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <span className="mr-2">£</span>
                    <Input
                      type='number'
                      min='0.01'
                      step='any'
                      className='border border-dark-4 text-light-1'
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='quantity'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-light-2'>
                  Quantity
                </FormLabel>
                <FormControl>
                  <Input
                    min={1}
                    type='number'
                    className='border border-dark-4 text-light-1'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availableFrom"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Available From Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={classMerge(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This is the date from which the product will be available for purchase.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name = "collectionAddress"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Full Address</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="border border-dark-4 text-light-1"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please enter your full address including your postal code.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Please choose your account type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ProductCategory).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Please select the category that best describes your product.  
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='notes'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-light-2'>
                  Notes
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={10}
                    className='border border-dark-4 text-light-1 '
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  These are additional notes about your product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> 
          
          <Button type='submit' onSubmit={onSubmit}>
            Add Product
          </Button>
        </form>
      </Form>
      </div>
    </div>
    </MaxWidthWrapper>
  );
};
