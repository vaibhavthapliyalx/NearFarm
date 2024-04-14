/**
 * @fileoverview This file contains the seller dashboard page component.
 */
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardTitle, CardHeader, CardContent, Card, CardDescription } from "@/components/ui/card"
// import { ResponsiveLine } from "@nivo/line"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"

export default function Component() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSignIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
              <UsersIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">+180.1% from last month</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Best Selling Products</CardTitle>
            <CardDescription>{"This month's top selling products by revenue"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div className="flex items-center">
                <img
                  alt="Thumbnail"
                  className="rounded-lg"
                  height="80"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "80/80",
                    objectFit: "cover",
                  }}
                  width="80"
                />
                <div className="ml-4">
                  <h3 className="font-semibold">Organic Tomatoes</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Vine-ripened, hand-picked, and absolutely delicious.
                  </p>
                </div>
                <div className="ml-auto font-semibold">$2500</div>
              </div>
              <div className="flex items-center">
                <img
                  alt="Thumbnail"
                  className="rounded-lg"
                  height="80"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "80/80",
                    objectFit: "cover",
                  }}
                  width="80"
                />
                <div className="ml-4">
                  <h3 className="font-semibold">Grass-fed Beef</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Lean, tender, and perfect for grilling.</p>
                </div>
                <div className="ml-auto font-semibold">$1800</div>
              </div>
              <div className="flex items-center">
                <img
                  alt="Thumbnail"
                  className="rounded-lg"
                  height="80"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "80/80",
                    objectFit: "cover",
                  }}
                  width="80"
                />
                <div className="ml-4">
                  <h3 className="font-semibold">Blueberry Bliss Smoothie</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    A refreshing blend of fresh blueberries, Greek yogurt, and honey.
                  </p>
                </div>
                <div className="ml-auto font-semibold">$1250</div>
              </div>
              <div className="flex items-center">
                <img
                  alt="Thumbnail"
                  className="rounded-lg"
                  height="80"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "80/80",
                    objectFit: "cover",
                  }}
                  width="80"
                />
                <div className="ml-4">
                  <h3 className="font-semibold">Artisanal Sourdough Bread</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Crispy crust, chewy texture, and the perfect holes.
                  </p>
                </div>
                <div className="ml-auto font-semibold">$950</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Predictions</CardTitle>
              <CardDescription>Estimated sales for the next quarter</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <LineChart className="w-full aspect-[1.25]" /> */}
            </CardContent>
          </Card>
          <Card>
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
                  <TableRow>
                    <TableCell className="font-medium">Alice Johnson</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Michael Smith</TableCell>
                    <TableCell className="text-right">$150.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Emily Davis</TableCell>
                    <TableCell className="text-right">$350.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">David Wilson</TableCell>
                    <TableCell className="text-right">$450.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Emma Lee</TableCell>
                    <TableCell className="text-right">$550.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
            <CardDescription>Cities with the most orders from your store</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center">
              <div>New York</div>
              <div className="font-semibold ml-auto">3K</div>
            </div>
            <div className="flex items-center">
              <div>Los Angeles</div>
              <div className="font-semibold ml-auto">1.2K</div>
            </div>
            <div className="flex items-center">
              <div>Chicago</div>
              <div className="font-semibold ml-auto">1.1K</div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function DollarSignIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function Package2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  )
}


function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}


function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}