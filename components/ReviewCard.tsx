/**
 * @fileoverview This file contains the ReviewCard component.
 */

// Imports.
import { Review, User } from '@/shared/interfaces';
import { Star, MoreHorizontal, StarHalf, Heart, Reply } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useEffect, useState } from 'react';
import ApiConnector from '@/app/services/ApiConnector';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useSession } from 'next-auth/react';
import { LikeAction } from '@/shared/constants';
import { useToast } from './ui/use-toast';
import EditReviewDrawer from './ModifyReviewDrawer';
import { reviewValidation } from '@/lib/validations/review.validation';
import * as z from 'zod';
import { usePathname } from 'next/navigation';
import ReplyDrawer from './ReplyDrawer';

// Interface for the props of the ReviewCard component.
interface IProps {
  review: Review;
  onDelete: (reviewId: string) => void;
  onModify: (newInput: z.infer<typeof reviewValidation>) => void,
}

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * This function renders the review card.
 * 
 * @param review - The review object.
 * @returns The rendered review card.
 */
export default function ReviewCard({ review, onDelete, onModify }: IProps) {
  const [reviewer, setReviewer] = useState<User>({} as User);
  const [liked, setLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(0);
  const {data: session} = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const userId = session?.user.id as string;
  const path = usePathname();
  const isProfilePage = path.includes('profile');

  const {toast} = useToast();

  /**
   * This function checks if the review is liked.
   * 
   * @param review The review object.
   * @param user The user object.
   * @returns Whether the review is liked.
   */
  function isReviewLiked(review: Review, user: User) {
    let isLiked = false;
    if (user && user.likedReviews && user.likedReviews.includes(review.id as string)) {
      isLiked = true;
    } else {
      isLiked = false;
    }
    return isLiked;
  }
  /**
   * This function checks if the user is authorized to perform the action.
   * 
   * @param reviewerId The id of the reviewer.
   * @returns Whether the user is authorized to perform the action.
   */
  function isAuthorizedToPerformAction(reviewerId: string) {
    // We don't want to show the actions on the profile page.
    if(isProfilePage) return false;
    return userId === reviewerId;
  }

  // Fetch the reviewer and check if the review is liked.
  useEffect(() => {
    async function fetchData(){
      try {
        const user = (await apiConnectorInstance.getUserFromId(userId as string)).data;
        const isLiked = isReviewLiked(review, user);
        setLiked(isLiked);
        setLikes(review.likes as number);
        const reviewer = (await apiConnectorInstance.getUserFromId(review.userId)).data;
        setReviewer(reviewer);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: 'destructive',
        });
      }
    }
    fetchData();
  }, []);

  /**
   * This function handles the review like.
   * 
   * @param review The review object.
   */
  async function handleReviewLike(review: Review) {
    const newLikedState = !liked;  
    const action = newLikedState ? LikeAction.LIKE : LikeAction.UNLIKE;
    const res = await apiConnectorInstance.updateReviewLike(review.id as string, userId, action);
    if (res.success) {
      setLiked(newLikedState);
      setLikes(newLikedState ? likes + 1 : Math.max(0, likes - 1));
    } else {
      toast({
        title: "Error",
        description: res.message,
        variant: 'destructive',
      });
    }
  }

  /**
   * This function renders the user actions.
   * This includes the modify and delete actions.
   * 
   * @returns The rendered user actions.
   */
  function renderUserActions(): React.ReactNode {
    return (
      <DropdownMenu open={dropdownOpen} >
        <DropdownMenuTrigger
          asChild
          className='overflow-hidden'
          onClick={()=> setDropdownOpen(!dropdownOpen)}
          >
            <MoreHorizontal size={24} className="text-gray-500 dark:text-gray-200 dark:hover:text-primary hover:text-primary hover:cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
        onInteractOutside={() => setDropdownOpen(false)}
          className='bg-white rounded-lg shadow dark:bg-gray-900'
          align='end'>
            <DropdownMenuItem role="button"
              className='cursor-pointer block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white'
            >
              <EditReviewDrawer onReviewSubmit={(data)=> {setDropdownOpen(!dropdownOpen); onModify(data)}} review={review} />
            </DropdownMenuItem>
            <DropdownMenuItem role="button"
              className='cursor-pointer block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white'
            >
              <div className={"text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"} 
              onClick={() => {setDropdownOpen(!dropdownOpen); onDelete(review.id as string)}}
              >
                <p>Delete</p>
              </div>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="w-full max-w-sm bg-white dark:bg-gray-800 h-auto rounded-xl shadow-md overflow-hidden mx-auto">
    <div className="flex justify-between items-center px-6 py-4">
      <div className="flex space-x-4">
        <Avatar className='mt-2 h-14 w-14'>
          <AvatarImage src={reviewer.image} alt={reviewer.name} />
          <AvatarFallback>{reviewer?.name?.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          {!isProfilePage ? (
            <div className="text-gray-800 dark:text-gray-200 text-lg font-semibold">{reviewer.name}</div>
          ) : (
            <div className="text-gray-800 dark:text-gray-200 text-md font-semibold">You reviewed {review.productName}</div>
          )
          }
          <div className='flex items-center'>
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} fill="#f0be8f" strokeWidth={0} className='h-5 w-5' />
            ))}
          </div>
          <div className="flex gap-1 absolute">
            {Array.from({ length: Math.floor(review.rating) }, (_, i) => (
              <Star key={i} fill="#ea580b" strokeWidth={0} className='h-5 w-5' />
            ))}
            {review.rating % 1 !== 0 && <StarHalf fill="#ea580b" strokeWidth={0} className='h-5 w-5' />}
          </div>
        </div>
          <div className="text-sm text-gray-500 dark:text-gray-200">{formatDistanceToNow(new Date(review.reviewedAt as string), { addSuffix: true })}</div>
          { review.edited && 
            <div className="text-xs text-gray-500 dark:text-gray-200 italic">
              Edited
            </div> 
          }
        </div>
      </div>
      <div>
        {isAuthorizedToPerformAction(review.userId) && renderUserActions()}
      </div>  
    </div>
    <div className="px-6 py-4">
      <div className="text-sm text-gray-800 dark:text-gray-200">
        {review.review}
      </div>
    </div>
    
    <div className="flex justify-between h-10 items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className=" bg-inherit hover:bg-inherit flex justify-start hover:cursor-pointer" onClick={(e) => {handleReviewLike(review); e.stopPropagation()}}>
          { liked ? (
            <Heart fill='#ea580b' className='text-primary h-6 w-6'  />
            ) : (
            <Heart className="w-6 h-6 text-gray-500 dark:text-gray-200 dark:hover:text-primary hover:text-primary" />
            )
          }
          <span className='ml-2'>{likes}</span>   
        </div>
        <div className="bg-inherit hover:bg-inherit flex justify-start hover:cursor-pointer" onClick={(e) => { e.stopPropagation()}}>
          <ReplyDrawer reviewId={review.id as string}/>
        </div>
      </div>
  </div>
  );
} 