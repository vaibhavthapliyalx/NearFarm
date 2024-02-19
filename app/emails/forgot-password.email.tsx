import { Button, Html } from "@react-email/components";
import React from "react";

export default function ForgotPasswordEmail({params}: {params: {
  email: string,
  name: string,
  resetLink: string
}}) {
 

  return (
    <Html>
      <head></head>
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', color: '#333' }}>
        <h1 style={{ color: '#333' }}>Hello {params.name},</h1>
        <p>
          We received a request to reset your password. If you didn't make the request, just ignore this email.
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
          If you have any issues or questions, please don't hesitate to contact us.
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
