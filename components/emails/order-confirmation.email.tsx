/**
 * @fileoverview This file contains the email template for the order confirmation email.
 */

// Imports
import { Order } from "@/shared/interfaces";
import { Html } from "@react-email/components";
import { format } from "date-fns";
import React from "react";

/**
 * @interface
 * Interface for the props of the OrderConfirmationEmail component.
 */
interface IProps {
  params: {
    name: string,
    order: Order,
    email: string
  }
}
/**
 * This function renders the order confirmation email template.
 * 
 * @param params  The parameters for the email.
 * @returns The rendered order confirmation email template.
 */
export default function OrderConfirmationEmail({params}: IProps) {
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
                        Hey {params.name}, Your Order is Confirmed! 🎉
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
                        Thank you for your recent order. The seller has received your order and will begin processing it shortly.
                      </p>
                      <p
                        style={{
                          margin: "0",
                        }}
                      >
                        If you have any questions or concerns, please reply to this email and we'll be happy to help.
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
                        Thankyou for choosing NearFarm for your shopping needs. We look forward to serving you again.
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
                        Happy Fresh Shopping! 🌽🍅🍆
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <footer style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
            <p>
              This email was sent to {params.email} because you are registered as a customer on NearFarm.
              If you believe this was sent in error, please contact us immediately.
            </p>
          </footer>
        </td>
      </tr>
    </table>
    </Html>
  );
}
