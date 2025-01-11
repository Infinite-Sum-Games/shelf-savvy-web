import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "./ui/button";
import { useState } from "react";
import SecureStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import { OTP_URL } from "../../constants";

export default function OTPPage() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const bankName = SecureStorage.getItem("bankname");
  const email = SecureStorage.getItem("email");

  const verifyOTP = async () => {
    if (!value || value.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    const payload = {
      bankname: bankName,
      email: email,
      otp: value,
    };
    console.log(payload);

    try {
      const response = await fetch(OTP_URL, {
        method: "POST", // Use POST method to send data
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
        body: JSON.stringify(payload), // Send the payload as JSON string
      });

      if (response.ok) {
        // Handle successful OTP verification
        navigate("/login")
      } else {
        // Handle error in verification
        alert("Failed to verify OTP.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      alert("An error occurred while verifying OTP.");
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full flex items-center justify-center flex-col">
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <div className="max-w-sm w-full mt-6 justify-center flex">
          <Button type="button" onClick={verifyOTP}>Verify OTP</Button>
        </div>
      </div>
    </div>
  );
}
