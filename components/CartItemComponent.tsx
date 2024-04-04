/**
 * @fileoverview This file contains the cart item component.
 */
import { CartItem } from "@/shared/interfaces";
import { TrashIcon } from "lucide-react";
import { TableRow, TableBody, TableCell } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import Image from "next/image";

// Interface for the CartItem component props.
interface IProps {
  item: CartItem;
  onClick: () => void;
  onQuantityChange: (newQuantity: number) => void;
  onRemove: () => void;
}

/**
 * This function renders the CartItem component.
 * 
 * @param item The cart item object.
 * @param onClick The function to call when the item is clicked.
 * @param onQuantityChange The function to call when the quantity is changed.
 * @param onRemove The function to call when the item is removed.
 * @returns The rendered CartItem component.
 */
export default function CartItemComponent({ item, onClick, onQuantityChange, onRemove }: IProps ) {
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
        <TableCell>£{item.price}</TableCell>
        <TableCell>
          <Select 
            defaultValue={item.quantity.toString()} 
            onValueChange={(newQuantity) => {
              onQuantityChange(parseInt(newQuantity));
            }}
          >
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              className=" dark:bg-gray-900"
            >
              {Array.from({ length: 20}, (_, i) => (
            <SelectItem key={i + 1} value={`${i + 1}`}>{i + 1}</SelectItem>
          ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>£{item.price * item.quantity}</TableCell>
        <TableCell>
          <Button 
            size="icon" 
            variant="outline" 
            onClick={(e)=>{e.stopPropagation(); onRemove();}}
          >
            <TrashIcon className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
