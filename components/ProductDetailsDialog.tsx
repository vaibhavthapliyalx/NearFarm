/**
 * @fileoverview This file contains the ProductDetailsDialog component.
 */

// Directive to use client side rendering.
'use client';

// Imports
import React from 'react';
import { useEffect, useState } from 'react'; // Import useEffect and useState
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle} from './ui/dialog';
import { Product, User } from '@/shared/interfaces';
import ApiConnector from '@/app/services/ApiConnector';
import { Table, TableBody, TableCell, TableHead, TableRow } from './ui/table';
import { formatDistanceToNow } from 'date-fns';

// Interface for the props of the ProductDetailsDialog component.
interface IProps {
  product: Product;
}

// This is the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * This function renders the product details dialog.
 * 
 * @param product - The product object.
 * @returns The rendered product details dialog.
 */
export default function ProductDetailsDialog({ product }: IProps) {
  // State variables.
  const [seller, setSeller] = useState<User | null>(null);

  // This is called when the component is rendered and when the product changes.
  useEffect(() => {
    apiConnectorInstance.getUserFromId(product.sellerId)
      .then((response) => {
        setSeller(response.data);
      })
      .catch((error) => {
        console.log(error);
        setSeller(null);
      });
  } , [product]);

  /*************** Render Function ****************/
  return (
    <Dialog>
      <DialogTrigger>
        <div role="button" className="ml-0 p-0 font-bold cursor-pointer text-primary hover:underline">
          View more details
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div>
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableCell>{product.category || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Collection Address</TableHead>
                <TableCell>{product.collectionAddress || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Available From</TableHead>
                <TableCell>{product.availableFrom ? new Date(product.availableFrom).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Listed</TableHead>
                <TableCell>{product.listedAt ? formatDistanceToNow(product.listedAt, {addSuffix: true}) : "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Market Price</TableHead>
                <TableCell>{`£${product.marketPrice}/-` || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Selling At</TableHead>
                <TableCell>{`£${product.salePrice}/-` || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Stock Quantity</TableHead>
                <TableCell>{product.quantity + " units available" || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Sold By</TableHead>
                <TableCell>{seller?.name || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableCell>{product.collectionAddress || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Notes</TableHead>
                <TableCell>{product.notes || "N/A"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
