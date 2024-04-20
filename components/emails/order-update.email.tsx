/**
 * @fileoverview This file contains the email template for the order update email.
 */

// Imports
import { Order } from "@/shared/interfaces";
import { Html } from "@react-email/components";
import React from "react";

/**
 * @interface
 * Interface for the props of the OrderUpdateEmail component.
 */
interface IProps {
  params: {
    name: string,
    order: Order,
    email: string,
    status: string,
    sellerName: string
  }
}

/**
 * This function renders the order update email template.
 * 
 * @param params  The parameters for the email.
 * @returns The rendered order update email template.
 */
export default function OrderUpdateEmail({params}: IProps) {
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
                        Hey {params.name}, We have an update on your order! 🎉
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
                        Your order for {params.order.items[0].productName}
                        has been updated to <strong>{params.status}</strong>.
                        Do not worry, your order is in good hands.
                        The seller {params.sellerName} is taking care of it.
                      </p>
                      <p
                        style={{
                          margin: "0",
                          color: "#000000"
                        }}
                      >
                        We will keep you updated on the status of your order.
                      </p>
                      <br/>
                      <p
                        style={{
                          margin: "0",
                          color: "#000000"
                        }}
                      >
                        If you have any questions, please feel free to reply to this email
                        with your order reference number and we will be happy to help.
                      </p>
                      <p
                        style={{
                          margin: "0",
                          color: "#000000"
                        }}
                      >
                        For more details, you can also check the status of your order on our platform.
                      </p>

                      <p
                        style={{
                          margin: "0",
                          color: "#000000"
                        }}
                      >
                        If you need to contact the seller, you can reply to this email and we will forward your message to them.
                      </p>

                      <p
                        style={{
                          margin: "0",
                          color: "#000000"
                        }}
                      >
                      In future releases, we will provide you with the ability to directly contact the seller
                      from our platform using our messaging service.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <h1>
                      Need Order Details? 📦 I got you!
                    </h1>
                    <h3 style={{margin: "0"}}>
                      Click on the link below and
                      navigate to the my orders tab in your profile page to view all your orders.
                    </h3>
                    <a href={`https://near-farm.vercel.app/profile/${params.order.userId}`}
                      style={{
                        color: "#153643",
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                    >
                      Track My Orders 🚚
                    </a>
                    
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
