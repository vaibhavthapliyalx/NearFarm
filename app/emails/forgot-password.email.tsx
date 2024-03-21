/**
 * @fileoverview This file contains the email template for the forgot password email.
 */

// Imports
import { Button, Html } from "@react-email/components";
import React from "react";

/**
 * @interface
 * Interface for the props of the ForgotPasswordEmail component.
 */
interface IProps {
  params: {
    email: string,
    name: string,
    resetLink: string
  }
}
/**
 * This function renders the forgot password email template.
 * 
 * @param params  The parameters for the email.
 * @returns The rendered forgot password email template.
 */ 
export default function ForgotPasswordEmail({params}: IProps) {
// ToDo: Fix the bug where there is <h character in the email.
  /********************************* Render Function **********************************/
  return (
    <Html>
      <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0', padding: '20px', color: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', maxWidth: '600px', width: '100%', border: '1px solid #ddd', overflow: 'auto' }}>
          <header style={{ textAlign: 'center', marginBottom: '20px' }}>
            {/** 
              * Here we are using the url of app logo stored in uploadthing server. This is done
              * because the browser tries to load the image relative to the current domain,
              * but in an email there is no concept of current domain. So the relative paths
              * don't work. Hence we use the full url of the image.
              */}
            <img src={process.env.APP_LOGO_FULL_URI} alt="NearFarm Logo" style={{ width: '300px', height: 'auto' }} />
          </header>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '20px', fontSize: '24px' }}>Password Reset Request</h1>
            <p style={{ marginBottom: '20px', fontSize: '16px', lineHeight: '1.5' }}>
              Hello {params.name},<br />
              We received a request to reset your password for NearFarm account. If you didn't make this request, you can ignore this email.
            </p>
            <div style={{ textAlign: 'center' }}>
              <Button
                href={params.resetLink}
                style={{
                  background: "#1a73e8",
                  color: "#fff",
                  padding: "10px 20px",
                  textDecoration: "none",
                  borderRadius: "5px",
                  display: "inline-block",
                  textAlign: "center",
                  fontSize: '16px'
                }}
              >
                Reset Password
              </Button>
            </div>
            <p style={{ marginTop: '20px', fontSize: '16px', lineHeight: '1.5' }}>
              If you did request this password reset, click the button above to reset your password. If you have any questions or need assistance, please contact our support team.
            </p>
          </div>
          <footer style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
            <p style={{ marginBottom: '5px' }}>
              Best regards,<br />
              The NearFarm Team
            </p>
            <p>
              This email was sent to {params.email} because you signed up for an account on NearFarm.
            </p>
          </footer>
        </div>
      </div>
    </Html>
  );
}
