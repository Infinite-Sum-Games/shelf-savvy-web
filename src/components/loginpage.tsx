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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { USER_LOGIN_URL } from "../../constants";
import secureStorage from "react-secure-storage";
import CryptoJS from "crypto-js";

// Define your validation schema
export const VBankLogin = z.object({
  bankname: z
    .string()
    .trim()
    .min(5)
    .regex(/^[a-zA-Z0-9_.]+$/),
  password: z.string().min(8).max(100).regex(new RegExp("^[a-zA-Z0-9_]*$")),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [bankname, setBankname] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const newHash = (text: string) => {
    const hash = CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
    return hash;
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const reqestBody = {
        bankname: bankname,
        password: newHash(password),
      };
      VBankLogin.parse(reqestBody);
      const response = await fetch(USER_LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.token) {
          secureStorage.setItem("token", responseData.token);
          secureStorage.setItem("email", responseData.email);
        }
        navigate("/Homepage");
      } else {
        // Handle errors based on response status
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Login failed");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Handle validation errors
        setErrorMessage(err.errors.map((error) => error.message).join(", "));
      }
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your bank name and password to login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="bankname">Bank Name</Label>
                  <Input
                    id="bankname"
                    type="text"
                    required
                    value={bankname}
                    onChange={(e) => setBankname(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {errorMessage && (
                  <div className="text-red-500 text-sm">{errorMessage}</div>
                )}
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Button
                  onClick={handleSignUp}
                  variant={"link"}
                  className="bg-transparent p-0"
                >
                  Sign up
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
