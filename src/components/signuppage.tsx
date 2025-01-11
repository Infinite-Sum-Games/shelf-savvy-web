import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { USER_REGISTER_URL } from "../../constants"; // Make sure this import is correct
import secureStorage from "react-secure-storage";
import { z } from "zod"; // Import zod
import CryptoJS from "crypto-js";

// Define the validation schema
export const VBankRegistration = z.object({
  bankname: z
    .string()
    .trim()
    .min(5, "Bank name must be at least 5 characters.")
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      "Bank name can only contain letters, numbers, and underscores."
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(30, "Password cannot exceed 30 characters.")
    .regex(
      new RegExp("^[a-zA-Z0-9_]*$"),
      "Password can only contain letters, numbers, and underscores."
    ),
  email: z.string().trim().email("Invalid email format."),
});

export default function SignUpPage() {
  const navigate = useNavigate();

  // State for form fields
  const [bankName, setBankName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const newHash = (text: string) => {
    const hash = CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
    return hash;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields using zod
    const validationResult = VBankRegistration.safeParse({
      bankname: bankName,
      email: email,
      password: password,
    });

    if (!validationResult.success) {
      // If validation fails, set the error message
      setError(validationResult.error.errors[0].message);
      return;
    }

    // Validation for matching passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Request body
    const requestBody = {
      bankname: bankName,
      email: email,
      password: newHash(password),
    };

    try {
      const response = await fetch(USER_REGISTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error response
        setError(data.message || "Registration failed.");
      } else {
        secureStorage.setItem("bankname", bankName);
        secureStorage.setItem("email", email);
        navigate("/otp");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.log(error);
    }
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your details below to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                {/* Bank Name */}
                <div className="grid gap-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    type="text"
                    placeholder="Your Bank Name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password */}
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Error message */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Sign Up Button */}
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </div>

              {/* Login Redirect Link */}
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Button
                  onClick={handleLoginRedirect}
                  variant={"link"}
                  className="bg-transparent p-0"
                >
                  Log in
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
