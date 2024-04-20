/**
 * @fileoverview This file contains the listings item component.
 */
import { ListingsItem } from "@/shared/interfaces";
import { FilePenLine, TrashIcon } from "lucide-react";
import { TableRow, TableBody, TableCell } from "./ui/table";
import { Button } from "./ui/button";
import Image from "next/image";
import { format, formatDistanceToNow } from "date-fns";

// Interface for the ListingsItem component props.
interface IProps {
  item: ListingsItem;
  onClick: () => void;
  onEdit: () => void;
  onRemove: () => void;
}

/**
 * This function renders the ListingsItem component.
 * 
 * @param item The listings item object.
 * @param onClick The function to call when the item is clicked.
 * @param onEdit The function to call when the item is edited.
 * @param onRemove The function to call when the item is removed.
 * @returns The rendered ListingsItem component.
 */
export default function ListingsItemComponent({ item, onClick, onEdit, onRemove }: IProps) {
  /**************** Render Function *****************/
  return (
    <TableBody onClick={onClick} className="cursor-pointer">
      <TableRow>
        <TableCell>
          <Image
            src={item.image}
            alt={item.name}
            width={100}
            height={100}
            className="rounded-lg"
          />
        </TableCell>
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell>{item.category}</TableCell>
        <TableCell>£{item.salePrice}</TableCell>
        <TableCell>£{item.marketPrice}</TableCell>
        <TableCell>{item.quantity}</TableCell>
        <TableCell>{format(new Date(item.availableFrom), 'PPP')}</TableCell>
        <TableCell>{formatDistanceToNow(new Date(item.listedAt),{addSuffix: true})}</TableCell>
        <TableCell>£{(item.salePrice * item.quantity).toFixed(2)}</TableCell>
        <TableCell>
          <div className="flex flex-row gap-1">
          <Button 
            size="icon" 
            variant="outline" 
            onClick={(e)=>{e.stopPropagation(); onEdit();}}
          >
            <FilePenLine className="h-4 w-4"/>
            <span className="sr-only">Edit</span>
          </Button>
          <Button 
            size="icon" 
            variant="outline" 
            onClick={(e)=>{e.stopPropagation(); onRemove();}}
          >
            <TrashIcon className="h-4 w-4 hover:text-red-500" />
            <span className="sr-only">Remove</span>
          </Button>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
