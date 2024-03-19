/**
 * @fileoverview This file contains the email template for the forgot password email.
 */

// Directive to use server side rendering.
'use server';

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
export default async function ForgotPasswordEmail({params}: IProps) {
// ToDo: Fix the bug where there is <h character in the email.
  /********************************* Render Function **********************************/
  return (
    <Html>
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', color: '#333' }}>
        <h1 style={{ color: '#333' }}>Hello {params.name},</h1>
        <p>
          We received a request to reset your password. If you didn&apos;t make the request, just ignore this email.
        <br/>
          Otherwise, you can reset your password using this link:
        </p>
        <Button
          href={params.resetLink}
          style={{
            background: "#1a73e8",
            color: "#fff",
            padding: "10px 20px",
            textDecoration: "none",
            borderRadius: "5px",
            display: "inline-block",
            margin: "20px 0"
          }}
        >
          Reset Password
        </Button>
        <p>
          If you have any issues or questions, please don&apos;t hesitate to contact us.
        </p>
        <p>
          Best regards,<br/>
          Your Team
        </p>
        <p className="text-sm text-gray-700 mt-4 mb-2">
          This email was sent to {params.email} because you signed up for an account on NearFarm.
        </p>
      </div>
    </Html>
  );
}
