"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Shield,
  Globe,
  BarChart3,
  Users,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built on Next.js 16 with server-side rendering for instant page loads and optimal performance.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-grade authentication and session management powered by Odoo's proven security framework.",
  },
  {
    icon: Globe,
    title: "Global Ready",
    description:
      "Multi-language, multi-currency, and multi-company support out of the box for global operations.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Live dashboards and reports that give you instant visibility into your business metrics.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Built-in messaging, activity tracking, and workflow automation to keep your team aligned.",
  },
  {
    icon: Layers,
    title: "Modular Architecture",
    description:
      "Start with what you need and expand. HR, Sales, Accounting, Inventory, and more.",
  },
];

const modules = [
  { name: "HR", color: "bg-emerald-500", desc: "Employees & Payroll" },
  { name: "Sales", color: "bg-blue-500", desc: "CRM & Quotations" },
  { name: "Inventory", color: "bg-amber-500", desc: "Stock & Warehouses" },
  { name: "Accounting", color: "bg-violet-500", desc: "Books & Invoicing" },
  { name: "Projects", color: "bg-rose-500", desc: "Tasks & Timesheets" },
  { name: "Purchases", color: "bg-cyan-500", desc: "Orders & Vendors" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-zinc-900 dark:text-white">
              Better Odoo
            </span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              Features
            </a>
            <a
              href="#modules"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              Modules
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24 lg:px-8 lg:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-white to-white dark:from-indigo-950/40 dark:via-zinc-950 dark:to-zinc-950" />
          <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 opacity-20">
            <div className="absolute inset-0 rounded-full bg-indigo-500 blur-3xl" />
          </div>
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
              <Zap className="h-3.5 w-3.5" />
              Next.js 16 + Odoo 19 Headless
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl"
          >
            The modern face of{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Odoo
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400"
          >
            A complete headless Odoo experience built with Next.js 16. Modern
            UI, real-time data, and the full power of Odoo&apos;s backend — reimagined
            for the web of tomorrow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <Link href="/login">
              <Button size="lg" className="gap-2">
                Launch App
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a
              href="#features"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              Learn more <ChevronRight className="inline h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Every app, rebuilt
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              We are rebuilding the frontend for every core Odoo application.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {modules.map((mod, i) => (
              <motion.div
                key={mod.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 text-center transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div
                  className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${mod.color} text-white shadow-sm`}
                >
                  <span className="text-lg font-bold">{mod.name[0]}</span>
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  {mod.name}
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {mod.desc}
                </p>
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/0 to-indigo-500/0 transition-colors group-hover:from-indigo-500/5 group-hover:to-purple-500/5" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Built for modern teams
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Performance, security, and developer experience at the core.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-indigo-600 px-6 py-16 text-center dark:bg-indigo-700">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Ready to experience Better Odoo?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-indigo-100">
            Connect your Odoo backend and launch the modern frontend in minutes.
          </p>
          <div className="mt-8">
            <Link href="/login">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 bg-white text-indigo-600 hover:bg-indigo-50"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 px-6 py-12 dark:border-zinc-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600 text-white">
              <Layers className="h-3 w-3" />
            </div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
              Better Odoo
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Built with Next.js 16 + Odoo 19. Open source.
          </p>
        </div>
      </footer>
    </div>
  );
}
