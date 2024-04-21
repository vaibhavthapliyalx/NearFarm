/**
 * @fileoverview This file contains the email template for the new order email.
 * 
 * This email is sent to the seller when a new order is placed.
 */

// Imports
import { Order } from "@/shared/interfaces";
import { Html } from "@react-email/components";
import { format } from "date-fns";
import React from "react";

/**
 * @interface
 * Interface for the props of the ForgotPasswordEmail component.
 */
interface IProps {
  params: {
    name: string,
    order: Order,
    email: string,
  }
}
/**
 * This function renders the new order email template.
 * 
 * @param params  The parameters for the email.
 * @returns The rendered new order email template.
 */
export default function NewOrderEmail({params}: IProps) {
  /********************************* Render Function **********************************/
  return (
    <Html>
      <table
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      style={{
        border: "none",
        borderCollapse: "collapse",
        borderColor: "#cccccc",
      }}
      width="100%"
      >
      <tr>
        <td
          align="center"
          style={{
            padding: "40px 0",
            backgroundColor: "ea580b"
          }}
        >
          <table
            cellPadding="0"
            cellSpacing="0"
            role="presentation"
            style={{
              border: "1px solid #cccccc",
              borderCollapse: "collapse",
            }}
            width="600"
          >
            <tr>
              <td
                align="center"
                style={{
                  padding: "40px 0 30px 0",
                }}
              >
                <img
                  alt="NearFarm Logo" 
                  height="230"
                  src={process.env.APP_LOGO_FULL_URI} 
                  style={{
                    aspectRatio: "300/230",
                    display: "block",
                    objectFit: "cover",
                  }}
                  width="auto"
                />
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "40px 30px 40px 30px",
                  backgroundColor: "#ffffff",
                }}
              >
                <table
                  cellPadding="0"
                  cellSpacing="0"
                  role="presentation"
                  style={{
                    borderCollapse: "collapse",
                  }}
                  width="100%"
                >
                  <tr>
                    <td
                      style={{
                        color: "#153643",
                        fontFamily: "Arial, sans-serif",
                      }}
                    >
                      <h1
                        style={{
                          fontSize: "24px",
                          margin: "0",
                        }}
                      >
                        Hey {params.name}, You have a new order! 🎉
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        color: "#153643",
                        fontFamily: "Arial, sans-serif",
                        fontSize: "16px",
                        lineHeight: "24px",
                        padding: "20px 0 30px 0",
                      }}
                    >
                      <p
                        style={{
                          margin: "0",
                        }}
                      >
                        Below are the order details. Please note that this is a simulated order and no real payment was made.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "16px",
                        lineHeight: "24px",
                      }}
                    >
                      <p  style={{margin: "0", color: "#000000" }}>
                        Order Reference: #{params.order.id}
                      </p>
                      <p  style={{margin: "0", color: "#000000"}}>
                        Order Date: {format(new Date(params.order.placedAt), 'PPP')}
                      </p>
                      <p  style={{margin: "0", color: "#000000"}}>
                        Total: £{params.order.orderTotal.toFixed(2)}/-
                      </p>
                      <p  style={{margin: "0", color: "#000000"}}>
                        Payment Method: Simulated (No real payment was made)
                      </p>
                      <p  style={{margin: "0", color: "#000000"}}>
                        Current Status: {params.order.status}
                      </p>
                      <p  style={{margin: "0", color: "#000000"}}>
                        Mode of Order Fulfillment: Collection
                      </p>
                      <div>                     
                      <h2>Order Items</h2>
                        {params.order.items?.map((item, index) => {
                          return (
                            <p>
                              {item.productName +" "}x{item.quantity}
                            </p>
                          )
                        })}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <h1>
                      For more details on your order , click the link below.
                    </h1>
                    <h3 style={{margin: "0"}}>
                      Click on the link below and
                      navigate to the manage orders page to view all your orders.
                    </h3>
                    <a href={`https://near-farm.vercel.app/orders`}
                      style={{
                        color: "#153643",
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                    >
                      📦Manage Orders📦
                    </a>
                    </tr>
                  <tr></tr>
                  <tr>
                    <td
                      style={{
                        color: "ea580b",
                        fontFamily: "Arial, sans-serif",
                        fontSize: "16px",
                        lineHeight: "24px",
                      }}
                    >
                      <p
                        style={{
                          margin: "0",
                        }}
                      >
                        Thank you for choosing NearFarm as your platform for selling your products. 
                        We are honored to partner with you on this journey towards promoting fresh and healthy shopping options.
                      </p>
                      <br/>
                      <p
                        style={{
                          margin: "0",
                        }}
                      >
                        Best regards,
                      </p>
                      <p
                        style={{
                          margin: "0",
                        }}
                        
                      >
                        The NearFarm Team.
                      </p>
                      Visit us at: 
                      <a href="https://near-farm.vercel.app"
                        style={{
                          color: "#153643",
                          cursor: "pointer",
                        }}
                      >
                        🌾NearFarm🌾
                      </a>
                      <p>
                        Happy Selling! 🌽🍅🍆
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <footer style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
            <p>
              This email was sent to {params.email} because you are registered as a seller on NearFarm.
              If you believe this was sent in error, please contact us immediately.
            </p>
          </footer>
        </td>
      </tr>
    </table>
    </Html>
  );
}
