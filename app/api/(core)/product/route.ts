/**
 * @fileoverview This file contains the API routes for the product.
 */
import { connectDB } from "@/lib/database";
import Product from "@/lib/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Extract query parameters from the URL.
    const id = request.nextUrl.searchParams.get('id');
    const name = request.nextUrl.searchParams.get('name');
    const category = request.nextUrl.searchParams.get('category');
    const sortByPrice = request.nextUrl.searchParams.get('sort_by_price'); // 'asc' or 'desc'
    const collectionAddress = request.nextUrl.searchParams.get('collection_address'); // expects a string of format 'longitude,latitude'
    const availableFromDate = request.nextUrl.searchParams.get('available_from_date'); // expects a date string
    const tags = request.nextUrl.searchParams.get('tags')?.split(','); // expects a comma-separated string of tags
    const page = Number(request.nextUrl.searchParams.get('page')) || 1; // pagination page number
    const limit = Number(request.nextUrl.searchParams.get('limit')); // number of documents per page

    // Construct the query object based on the query parameters.
    let query = {};
    if (id) {
      query = { ...query, _id: id };
    }
    if (name) { 
      query = { ...query, name: { $regex: name, $options: 'i' } };
    }
    if (category) {
      query = { ...query, category: category };
    }
    if (tags) {
      query = { ...query, tags: { $in: tags } };
    }

    // Construct the sort object based on the query parameters.
    let sort = {};
    if (sortByPrice) {
      sort = { ...sort, sale_price: sortByPrice === 'asc' ? 1 : -1 };
    }
    if (availableFromDate) {
      sort = { ...sort, available_from: 1 };
      query = { ...query, available_from: { $gte: new Date(availableFromDate) } };
    }
    // If collectionAddress is provided, sort products based on the distance from the collection address
    if (collectionAddress) {
      const [longitude, latitude] = collectionAddress.split(',').map(Number);
      query = {
        ...query,
        collection_address: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude]
            }
          }
        }
      };
    }

    // If the limit parameter is not provided or is -1, set limit to undefined
    const limitParam = limit === null || limit === -1 ? undefined : limit;
    // Fetch the products based on the query and sort parameters.
    const product = await Product.find(query)
      .sort(sort)
      .skip((page - 1) * (limitParam || 0)) // Use 0 as a fallback when limitParam is undefined
      .limit(limitParam || Number.MAX_SAFE_INTEGER);

    // Return the response with the fetched products.
    if (product) {
      return NextResponse.json({
        status: 200,
        body: {
          success: true,
          message: "Product found",
          data: product
        }
      });
    } else {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "No product found"
        }
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: {
        success: false,
        message: 'An error occurred while fetching the product',
        error: error
      }
    });
  }
}

