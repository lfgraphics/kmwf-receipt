"use client";
import { useEffect, useState } from "react";
import { isAuthenticated, login } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";
import Link from "next/link";
import Loading from "@/app/loading";

export default function Login() {
  const [phoneNo, setPhoneNo] = useState<string>("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneNoError, setPhoneNoError] = useState<string>("");

  useEffect(() => {
    if (isAuthenticated()) {
      window.location.href = "/dashboard";
    }
  }, []);

  const validatephoneNo = (phoneNo: string) => {
    const regex = /^[1-9]\d{9,12}$/;
    if (phoneNo === "0123456789" || phoneNo === "9876543210") {
      return false;
    }
    return regex.test(phoneNo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await login(phoneNo, password);
      if (response.user.verified) {
        window.location.href = "/dashboard";
      } else {
        alert(
          "Account not verified. Please contact an administrator to verify your account."
        );
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      {loading && <Loading />}
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phoneNo">Phone Number</Label>
                <Input
                  id="phoneNo"
                  placeholder="Enter your phone number"
                  value={phoneNo}
                  onChange={(e) => {
                    setPhoneNo(e.target.value);
                    if (!validatephoneNo(e.target.value)) {
                      setPhoneNoError(
                        "Phone number is invalid. It cannot be sequential, less than 10 or more than 13 characters."
                      );
                    } else {
                      setPhoneNoError("");
                    }
                  }}
                  required
                />
                {phoneNoError && (
                  <p className="text-red-500 mt-1">{phoneNoError}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          </CardFooter>
        </form>
        <div className="my-4 text-center">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
