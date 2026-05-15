"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Layers, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { login } from "@/app/lib/odoo/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError("");

    try {
      const result = await login(formData);

      if (result.success) {
        router.push("/apps");
        router.refresh();
      } else {
        setError(result.error || "Invalid credentials");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950"
    >
      {/* Left side - decorative */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between relative overflow-hidden bg-indigo-600 p-12 dark:bg-indigo-700"
      >
        <div className="absolute inset-0 opacity-20"
        >
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-purple-500 blur-3xl" />
        </div>

        <div className="relative z-10"
        >
          <Link href="/" className="flex items-center gap-2 text-white"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20"
            >
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold"
            >Better Odoo</span>
          </Link>
        </div>

        <div className="relative z-10"
        >
          <h2 className="text-3xl font-bold text-white"
          >
            Welcome back
          </h2>
          <p className="mt-4 text-indigo-100"
          >
            Sign in to access your Odoo workspace with a modern, lightning-fast
            interface.
          </p>
        </div>

        <div className="relative z-10 text-sm text-indigo-200"
        >
          Next.js 16 + Odoo 19 Headless
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-sm"
        >
          <div className="mb-8 lg:hidden"
          >
            <Link href="/" className="flex items-center gap-2 text-zinc-900 dark:text-white"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white"
              >
                <Layers className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold"
              >Better Odoo</span>
            </Link>
          </div>

          <div className="mb-8"
          >
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white"
            >
              Sign in to your account
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400"
            >
              Enter your Odoo credentials to continue
            </p>
          </div>

          <form action={handleSubmit} className="space-y-5"
          >
            <Input
              label="Email or Username"
              name="login"
              type="text"
              required
              autoComplete="username"
              placeholder="admin"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />

            <Input
              label="Database (optional)"
              name="db"
              type="text"
              placeholder="odoo"
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              {!isLoading && (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400"
          >
            Don&apos;t have an account?{" "}
            <span className="text-zinc-900 dark:text-zinc-200"
            >Contact your administrator</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
