/**
 * @fileoverview This file contains the seller dashboard page component.
 * 
 * Note: This is a middleware protected route. Only authenticated sellers can access this page.
 */

'use client';
// Imports.
import ApiConnector from "@/app/services/ApiConnector";
import LoadingSpinner from "@/components/LoadingAnimations/LoadingSpinner";
import MapRenderer from "@/components/MapRenderer";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Badge } from "@/components/ui/badge";
import { CardTitle, CardHeader, CardContent, Card, CardDescription } from "@/components/ui/card";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { MapType, ToastType } from "@/shared/constants";
import { Product, User } from "@/shared/interfaces";
import { ServerCrash } from "lucide-react";
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

export default function Dashboard() {
  const [seller, setSeller] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const router = useRouter();

  // This fetches the seller details and the best selling products when the component mounts
  useEffect(() => {
    // Check if the calculation and analysis have been done before
    // This is to prevent the calculation from running every time the page is refreshed.
    const hasRunCalculation = sessionStorage.getItem('hasRunCalculation');
    // Fetch the seller details
    async function fetchSeller() {
      const session =  await apiConnectorInstance.getCurrentUserFromSession();
      const sellerId = session.id;
      // Now we fetch the seller details from the server using the sellerId.
      const res = await apiConnectorInstance.getUserFromId(sellerId);
      if(res.success) {
        setSeller(res.data);
        const customerPromises = res.data.roleSpecificData?.myCustomers?.map(async (customerId: string) => {
          const res = await apiConnectorInstance.getUserFromId(customerId);
          if(res.success) {
            return res.data;
          }
        });
        const customerArray = await Promise.all(customerPromises);
        setCustomers(customerArray);
      }
    }

    // Fetch all the listed products.
    async function fetchAllListedProducts() {
      const res = await apiConnectorInstance.getProducts({
        sellerId: seller?.id,
        limit: 4,
        bestSelling: true
      });
      if(res.success) {
        console.log(res.data)
        setProducts(res.data);
      }
    }

    async function fetchCustomerCities() {
      const res = await apiConnectorInstance.fetchAllCustomerCities();
      setCities(res.data);
    }

    // Fetch the seller details.
  Promise.all([
    hasRunCalculation ? Promise.resolve() : simulateCalculationAndDeepAnalysis(),
    fetchSeller(), 
    fetchAllListedProducts(), 
    fetchCustomerCities()
  ])
  .then(() => {
    // Store a flag in local storage
    if (!hasRunCalculation) {
      sessionStorage.setItem('hasRunCalculation', 'true');
    }
  })
  .finally(() => {
    setIsLoading(false);
  });

  // Cleanup function on unmount.
  return function cleanup() {
    setSeller(null);
    setProducts([]);
    setCustomers([]);
  }
},[]);

  /**
   *  Simulates a long running calculation and deep analysis process.
   * 
   * @returns Promise<void>
   */
  async function simulateCalculationAndDeepAnalysis() {
    return new Promise<void>((resolve) => {
    setIsLoading(true)
    setMessage("Gathering information...");
  
    // After a delay of one second, 
    setTimeout(() => {
      setMessage("Calculating revenue...");
  
      // After another delay of one second, display analyzing sales data.
      setTimeout(() => {
        setMessage("Analyzing sales data...");
  
        // After another delay of one second, display analyzing customer data.
        setTimeout(() => {
          setMessage(" Analyzing customer data...");
  
            // After another delay of two seconds, display gathering customer locations.
            setTimeout(() => {
              setMessage("Gathering customer locations...");
  
              setTimeout(() => {
                setMessage("Preparing Insights...");
                // After another delay of one second, resolve the promise.
                setTimeout(() => {
                  resolve();
                }, 1000);
              }, 2000);
            }, 2000);
          }, 1500);
        }, 2000);
      }, 2000);
    })
  }

  // If the order is empty, render the empty order component.
  if ((!products || !customers || !cities || products.length === 0 || 
    customers.length === 0 || cities.length === 0)&& !isLoading) {
    return (
      <MaxWidthWrapper>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <ServerCrash
              size={80}
              className="text-dark-3"
            />
            <h1 className="font-semibold text-2xl md:text-3xl">
              {"Not enough data available to get insights at the moment."}
            </h1>
            <h1 className="font-semibold text-2xl md:text-3xl">
              {"Please check back later."}
            </h1>
          </div>
        </div>
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper>
      <LoadingSpinner display={isLoading} message={message} /> 
      <div className="flex flex-col w-full min-h-screen">
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-inherit border border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">£{seller?.roleSpecificData?.totalRevenue}/-</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-inherit border border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{seller?.roleSpecificData?.productsSold}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">in last month</p>
              </CardContent>
            </Card>
          </div>
          <Card className="bg-inherit border border-orange-200">
            <CardHeader>
              <CardTitle>Best Selling Products</CardTitle>
              <CardDescription>{"This month's top selling products by number"}</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product: Product) => (
                <Card className="flex border-transparent space-x-6 justify-center 
                  bg-inherit hover:border-orange-300 hover:border-2 hover:scale-105 
                  transition-all duration-200 transform hover:cursor-pointer" 
                  key={product.id}
                >
                  <CardContent 
                    className="flex space-x-6 items-center w-full"
                    onClick={() => router.push(`/products/${product.id}`)}
                  >
                    <Image
                      src={product.image}
                      alt="Thumbnail"
                      height={60}
                      width={60}
                      className="rounded-full"
                      objectFit="cover"
                    />
                    <div className="flex flex-col space-y-2">
                      <h3 className="font-semibold">{product.name.slice(0,20).trim()}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {product.description.slice(0, 60).trim()}...
                      </p>
                      <div className="mt-auto font-semibold">£{(product.salePrice * product.soldTillDate).toFixed(2)}</div>
                      <Badge variant={'outline'} className="w-20 bg-green-300 dark:bg-green-800" > {product.soldTillDate} Sold</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            </CardContent>
            </Card>
            {/** Dynamically render the results after all data is fetched */}
          {!isLoading && seller && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-inherit border border-orange-200">
                  <CardHeader>
                    <CardTitle>Customer Traffic</CardTitle>
                    <CardDescription> A map showing the geographic distribution of your customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MapRenderer
                      onDismiss={()=>{}}
                      containerStyle={{height: '500px', width: '100%'}}
                      type={MapType.NEARBY_CUSTOMERS}
                      customCoordinates={cities.map((city: any) => {
                        return {
                          coordinates: {
                            lat: city.coordinates.lat as number,
                            lng: city.coordinates.lng as number
                          },
                          userId: city.userId as string
                        }
                      })}
                    />
                  </CardContent>
                </Card>
                <Card className="bg-inherit border border-orange-200">
                  <CardHeader>
                    <CardTitle>Top Customers</CardTitle>
                    <CardDescription>Customers who have spent the most in your store</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead className="text-right">Spent</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customers.map((customer: User, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{customer.name}</TableCell>
                            <TableCell className="text-right">£{customer.totalSpent || 0}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
          <Card className="bg-inherit border border-orange-200">
            <CardHeader>
              <CardTitle>Top Locations</CardTitle>
              <CardDescription>Cities with the most orders</CardDescription>
            </CardHeader>
            {cities.map((city:any) => {
              return (
                <CardContent className="grid gap-4" key={city.userId}>
                  <div className="flex items-center">
                    <div className="font-semibold">{city.city ?? "N/A"}</div>
                    {/* <div className="font-semibold ml-auto">{}</div> */}
                  </div>
                </CardContent>
              )
            })}
          </Card>
        </main>
      </div>
    </MaxWidthWrapper>
  )
}