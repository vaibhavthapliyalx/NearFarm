/**
 * @fileoverview This file contains the ReplyDrawer component.
 */
"use client";

// Imports.
import { z } from "zod";
import Image from "next/image";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReplyValidation } from "@/lib/validations/reply.validation";
import { useEffect, useState } from "react";
import { Review } from "@/shared/interfaces";
import { useSession } from "next-auth/react";
import { Reply } from "lucide-react";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import ApiConnector from "@/app/services/ApiConnector";
import { isObjectEmpty } from "@/lib/utilityfunctions";
import { useToast } from "@/components/ui/use-toast";
import { ToastType } from "@/shared/constants";
import { formatDistanceToNow } from "date-fns";

// Interface for the props of the ReplyDrawer component.
interface IProps {
  reviewId: string;
}

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * This function renders the ReplyDrawer component.
 * 
 * @param review The review object.
 * @returns The rendered ReplyDrawer component.
 */
export default function ReplyDrawer({reviewId}: IProps) {
  // State variables.
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState<Review>({} as Review);
  const {data: session} = useSession();
  const [activeTrigger, setActiveTrigger] = useState< 'compose' | 'view' | null>(null);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof ReplyValidation>>({
    resolver: zodResolver(ReplyValidation),
    defaultValues: {
      reply: "",
    },
  });

  /**
   * This function fetches the review by id from the backend and sets the review state.
   */
  async function fetchReview() {
    const response = await apiConnectorInstance.getReviewById(reviewId);
    if (response.success) {
      setReview(response.data);
    }
  }

  useEffect(() => {
    // Fetch the review.
    fetchReview();

    return function cleanup() {
      setReview({} as Review);
    }
  }, [reviewId]);

  /**
   * This function is called when the form is submitted.
   * 
   * @param values The form values.
   */
  async function onSubmit(values: z.infer<typeof ReplyValidation>) {
    // We don't want to submit the form if there are no values.
    if (isObjectEmpty(values)) {
      return;
    }
    try {
      const res = await apiConnectorInstance.addReplyToReview({userId: session?.user.id as string,reviewId: review.id as string,reply: values.reply});
      if (res.success) {
        toast({
          description: res.message,
          title: "Success",
          variant: ToastType.SUCCESS,
        });
      } else {
        toast({
          description: res.message,
          title: "Error",
          variant: ToastType.DESTRUCTIVE,
        });
      }
    } catch (error) {
      toast({
        description: "Failed to add reply",
        title: "Error",
        variant: ToastType.DESTRUCTIVE,
      });
    } finally {
      // Reset the form and close the drawer.
      form.reset();
      setOpen(false);

      // Fetch the review again to update the replies in the end.
      fetchReview();

    }
  }

  /******************** Render Function *******************/
  return (
    <div onClick={(e) => {e.stopPropagation()}}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          { ( session && session.user.id !== review.userId) &&
            <div  role="button" className="justify-center flex flex-row items-center gap-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTrigger('compose');
              setOpen(true);
            }}
          >
            <Reply className="w-6 h-6 text-gray-500 dark:text-gray-200 dark:hover:text-primary hover:text-primary mb-1" />
            {review && review.replies && (
            <div className='mt-0 text-subtle-medium text-gray-1 hover:text-primary' onClick={(e) => {e.stopPropagation(); setActiveTrigger('view'); setOpen(true)}}>
              {review.replies.length}
            </div>
          )}
          </div>
          }
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{activeTrigger === 'compose' ? 'Reply to this review' : 'All replies to this review'}</DrawerTitle>
          </DrawerHeader>
          { activeTrigger === 'compose' && (
            <FormProvider {...form}>
              <form className='mt-4 flex ml-4 mr-4 items-center gap-4 border-y border-y-dark-4 py-5 max-xs:flex-col' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name='reply'
                  render={({ field }) => (
                    <FormItem className='flex w-full items-center gap-3'>
                      <FormLabel>
                        <Image
                          src={session?.user.image as string}
                          alt='current_user'
                          width={48}
                          height={48}
                          className='rounded-full object-cover'
                        />
                      </FormLabel>
                      <FormControl className='border-none bg-transparent'>
                        <Input
                          type='text'
                          {...field}
                          placeholder={`Reply to @${review.userName}`}
                          className='no-focus text-light-1 outline-none'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type='submit' className='rounded-3xl bg-primary-500 px-8 py-2 hover:text-white !text-small-regular text-light-1 max-xs:w-full'>
                  Reply
                </Button>
              </form>
            </FormProvider>
          )}
          { activeTrigger === 'view' && (
            <div className="mt-4 p-4">
              <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '300px' }}>
                {review.replies && review.replies.length > 0 && review.replies.map((reply, index) => (
                  <Card key={index} className="bg-inherit dark:bg-gray-800">
                    <CardHeader>
                      <div className="flex items-center">
                        <Avatar>
                          <AvatarImage alt={`@${reply.user}`} src={reply.userAvatar} />
                          <AvatarFallback>{reply.user.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <CardTitle>{reply.user}</CardTitle>
                          <CardDescription>
                            <span>
                            @{reply.username} • {formatDistanceToNow(new Date(reply.repliedAt as string), { addSuffix: true })}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg">{reply.reply}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
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