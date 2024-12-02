"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, signup } from "@/lib/auth";
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
import { UserPlus } from "lucide-react";
import Link from "next/link";
import Loading from "@/app/loading";
import { checkPasswordStrength } from "@/lib/utils";

interface PasswordStrength {
  strength: string;
  messages: string[];
}

export default function Signup() {
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phoneNo, setPhoneNo] = useState<string>("");
  const [passwordStrength, setPasswordStrength] =
    useState<PasswordStrength | null>(null);
  const [phoneNoError, setPhoneNoError] = useState<string>("");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

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

  const handlePsswordStrenght = (password: string) => {
    let { strength, messages } = checkPasswordStrength(password);
    setPasswordStrength({ strength, messages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!validatephoneNo(phoneNo)) {
      setPhoneNoError(
        "Phone number is invalid. It cannot be sequential, less than 10 or more than 13 characters."
      );
      setLoading(false);
      return;
    }
    try {
      await signup({ password, name, phoneNo });
      alert(
        "Signup successful. Your account has been created. Please wait for admin verification."
      );
      router.push("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      alert(
        "Signup failed. An error occurred during signup. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      {loading && <Loading />}
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    handlePsswordStrenght(e.target.value);
                  }}
                  required
                />
                {passwordStrength && (
                  <div className="mt-2">
                    <p
                      className={`text-${
                        passwordStrength.strength === "Strong" ? "green" : "red"
                      }-500`}
                    >
                      {passwordStrength.strength} Password
                    </p>
                    <ul>
                      {passwordStrength.messages.map(
                        (message: string, index: number) => (
                          <li
                            key={index}
                            className={`text-${
                              message.includes("should") ? "red" : "green"
                            }-500`}
                          >
                            {message}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              <UserPlus className="mr-2 h-4 w-4" /> Sign Up
            </Button>
          </CardFooter>
        </form>
        <div className="my-4 text-center">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
