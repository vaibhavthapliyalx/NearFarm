/**
 * @fileoverview This file contains the AddReviewDrawer component.
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
  disabled: boolean;
}

/**
 * This function renders the AddReviewDrawer component.
 *
 * @param onReviewSubmit The function to submit the review.
 * @param disabled The flag to disable the button.
 * @returns The rendered AddReviewDrawer component.
 */
export default function AddReviewDrawer({ onReviewSubmit, disabled }: IProps) {
  // State variables.
  const [open, setOpen] = useState(false);

  // Form created using react-hook-form.
  const form = useForm<z.infer<typeof reviewValidation>>({
    resolver: zodResolver(reviewValidation),
  });

  const renderAddReviewForm = ({ className }: { className: string }) => (
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
                    placeholder='Write your review here...'
                    // This fixes the Bug where the drawer closes when user presses spacebar.
                    // To fix this, we need to stop the event propagation.
                    // This is because the Drawer component listens for the keydown event and closes the drawer when the spacebar is pressed.
                    // ToDo: Investigate this issue further and fix the root cause at the Shadcn repository.
                    onClick={(e) => e.stopPropagation()}
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
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button size="sm" variant="link" className="ml-2 justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            disabled={disabled}
          >
            Write a review
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Add Review</DrawerTitle>
            <DrawerDescription>
              {`Share your thoughts about this product. Click submit when you're done.`}
            </DrawerDescription>
          </DrawerHeader>
          <FormProvider {...form}>
            {renderAddReviewForm({ className: "p-4" })}
          </FormProvider>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
