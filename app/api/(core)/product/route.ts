/**
 * @fileoverview This file contains the API routes for the products.
 */
import { connectDB } from "@/lib/database";
import Product from "@/lib/models/product.model";
import { ProductCategory, SortOrder } from "@/shared/constants";
import { QueryParams } from "@/shared/interfaces";
import { NextRequest, NextResponse } from "next/server";
import qs from "qs";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    // Extract query parameters from the URL.
    const params: QueryParams = Object.fromEntries(request.nextUrl.searchParams);
    const id = params.id;
    const name = params.name;
    const sortByPrice = params.sortByPriceOrder; // 'asc' or 'desc'
    const availableFromDate = params.sortByAvailableFromDate; // expects a date string
    const collectionAddress = params.sortByNearestLocation; // expects a string of coordinates
    const page = Number(params.page) || 1; // pagination page number
    const limit = Number(params.limit); // number of documents per page
    // Extract all 'category' parameters from the URL.
    const categories = request.nextUrl.searchParams.getAll('category');

    // Construct the query object based on the query parameters.
    let query = {};
    if (id) {
      query = { ...query, _id: id };
    }
    if (name) { 
      query = { ...query, name: { $regex: name, $options: 'i' } };
    }

    // If categories are provided, filter the products based on the categories.
    // Here, we parse the query string and extract the category parameter.
    // If the category is 'all', we don't filter based on category.
    if (categories) {
      const parsedCategories = categories.map(queryString => qs.parse(queryString).category).flat();

      // If we receive undefined or empty categories, this means that the user has not selected any category.
      // In this case, we apply ALL as the default category.
      const filteredCategories = parsedCategories.map(category => category|| ProductCategory.ALL);
      if (filteredCategories.length > 0 && !filteredCategories.includes(ProductCategory.ALL)) {
        query = { ...query, category: filteredCategories };
      }
    }

    // Construct the sort object based on the query parameters.
    let sort = {};
    if (sortByPrice) {
      sort = { ...sort, sale_price: sortByPrice === SortOrder.ASCENDING ? 1 : -1 };
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
    
    // Calculate the total number of items and pages based on the query.
    const totalItems = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    // Return the response with the fetched products.
    if (product) {
      return NextResponse.json({
        status: 200,
        body: {
          success: true,
          message: "Product found",
          data: product,
          totalPages: totalPages
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

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // ToDO: If there is an issue with the request, add validation here.
    const body = await request.json();

    // Check if the same product already exists.
    // If it does, increment the quantity.
    const existingProduct = await Product.findOne({ name: body.name, seller_id: body.sellerId });

    if (existingProduct) {
      Product.updateOne({ _id: existingProduct._id }, { $inc: { quantity: body.quantity } });
      return NextResponse.json({
        status: 200,
        body: {
          success: true,
          message: "Same product already exists. Quantity incremented successfully."
        }
      });
    }
    const newProduct = {
      name: body.name,
      description: body.description,
      sale_price: body.salePrice,
      market_price: body.marketPrice,
      quantity: body.quantity,
      image: body.image,
      seller_id: body.sellerId,
      available_from: body.availableFrom,
      listed_at: new Date().toISOString(),
      collection_address: body.collectionAddress,
      category: body.category,
      notes: body.notes
    };
    // Create product
    const product = await Product.create(newProduct);

    return NextResponse.json(
      {
        status: 200,
        body: {
          success: true,
          message: "Product created successfully",
          data: product._id
        }
      }
    );
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: {
        success: false,
        message: 'An error occurred while creating the product. Please try again.',
        error: error
      }
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    const body = await request.json();

    const product = await Product.findOneAndUpdate({
      _id: body.id
    },
    {
      name: body.name,
      description: body.description,
      sale_price: body.salePrice,
      market_price: body.marketPrice,
      quantity: body.quantity,
      image: body.image,
      available_from: body.availableFrom,
      collection_address: body.collectionAddress,
      category: body.category,
      notes: body.notes
    },
    { 
      upsert: false,
      new: true 
    });

    if (product) {
      return NextResponse.json({
        status: 200,
        body: {
          success: true,
          message: "Product updated successfully",
          data: product
        }
      });
    } else {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "Product not found. Please create a new listing."
        }
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: {
        success: false,
        message: "An error occurred while updating the product",
        error: error
      }
    });
  }
}

export async function DELETE(request: NextRequest) {
  // Connect to MongoDB
  await connectDB();
  const id = request.nextUrl.searchParams.get('id');

  try {
    const product = await Product.findOneAndDelete({
      _id: id
    });

    if (product) {
      return NextResponse.json({
        status: 200,
        body: {
          success: true,
          message: "Product deleted successfully",
        }
      });
    } else {
      return NextResponse.json({
        status: 404,
        body: {
          success: false,
          message: "Couldn't delete the product. Product not found.",
        }
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 400,
      body: {
        success: false,
        message: "An error occurred while deleting the product",
        error: error
      }
    });
  }
}

