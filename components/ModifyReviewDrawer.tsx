/**
 * @fileoverview This file contains the EditReviewDrawer component.
 */

// Imports.
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { classMerge } from "@/lib/utilityfunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { reviewValidation } from "@/lib/validations/review.validation";
import RateStars from "./RateStars";

// Interface for the props of the component.
interface IProps {
  onReviewSubmit: (formInput: z.infer<typeof reviewValidation>) => void;
  review: z.infer<typeof reviewValidation>;
}

/**
 * This function renders the EditReviewDrawer component.
 *
 * @param onReviewSubmit The function to submit the review.
 * @returns The rendered EditReviewDrawer component.
 */
export default function EditReviewDrawer({ onReviewSubmit, review }: IProps) {
  // State variables.
  const [open, setOpen] = useState(false);

  // Form created using react-hook-form.
  const form = useForm<z.infer<typeof reviewValidation>>({
    resolver: zodResolver(reviewValidation),
    defaultValues: review,
  });

  const renderEditReviewForm = ({ className }: { className: string }) => (
    <form className={classMerge("grid items-start gap-4", className)} onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit((data) => {
        onReviewSubmit(data);
        setOpen(false);
      })(e)
    }}>
      <div className="grid gap-2">
        <FormField
          control={form.control}
          name='rating'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Rating
              </FormLabel>
              <FormControl>
                <div className="flex flex-row gap-1 items-center">
                  <RateStars
                    defaultRating={field.value} 
                    onRatingChange={(rating) => field.onChange(rating)} 
                  />
                </div>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
      </div>
      <div className="grid gap-2">
        <FormField
          control={form.control}
          name='review'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Review
              </FormLabel>
              <FormControl>
                <div className="flex flex-row gap-1 items-center">
                  <Textarea
                    className='border border-dark-4  text-light-1'
                    {...field}
                    // This fixes the Bug where the drawer closes when user presses spacebar.
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
      </div>
      <Button type="submit">Submit Review</Button>
    </form>
  )

  /******************** Render Function ************************/
  return (
    <div onClick={(e) => {e.stopPropagation()}}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <div  role="button" className="justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            Modify
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Edit Review</DrawerTitle>
            <DrawerDescription>
              {`Share your thoughts about this product. Click submit when you're done.`}
            </DrawerDescription>
          </DrawerHeader>
          <FormProvider {...form}>
            {renderEditReviewForm({ className: "p-4" })}
          </FormProvider>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
