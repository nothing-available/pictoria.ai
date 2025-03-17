"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignupForm } from "@/components/authentication/SignupForm";
import Link from "next/link";
import { ResetPassword } from "./ResetPasswordForm";
import { LoginForm } from "./LoginForm";

export function AuthForm() {
  const [mode, setmode] = useState("login");

  return (
    <div className='space-y-6'>
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tighter'>
          {mode === "reset"
            ? "reset password"
            : mode === "login"
              ? "Login"
              : "Sign Up"}
        </h1>

        <p className='text-sm text-muted-foreground'>
          {mode === "reset"
            ? "Enter your email to reset your password"
            : mode === "login"
              ? "Enter your credentials to login"
              : "Enter your details to sign up"}
        </p>
      </div>

      {mode === "login" && (
        <>
          <LoginForm />
          <div className='text-center flex justify-between'>
            <Button
              variant={"link"}
              className='p-0 text-primary-foreground'
              onClick={() => {
                setmode("signup");
              }}>
              Need an account? Sign up
            </Button>

            <Button
              variant={"link"}
              className='p-0 text-primary-foreground'
              onClick={() => {
                setmode("reset");
              }}>
              Forgot Password
            </Button>
          </div>
        </>
      )}

      {mode == "signup" && (
        <>
          <SignupForm />
          <div className='text-center '>
            <Button
              variant={"link"}
              className='p-0 text-primary-foreground'
              onClick={() => setmode("login")}>
              Already have an account? Login
            </Button>
          </div>

          <p className='px-8 text-center text-sm text-muted-foreground'>
            By signing up, you agree to our{" "}
            <Link
              href='#'
              className='underline underline-offset-4 hover:text-primary'>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href='#'
              className='underline underline-offset-4 hover:text-primary'>
              Privacy Policy
            </Link>
          </p>
        </>
      )}

      {mode === "reset" && (
        <>
          <ResetPassword />
          <div className='text-center'>
            <Button
              variant={"link"}
              className='p-0 text-primary-foreground'
              onClick={() => setmode("login")}>
              Back to login
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
