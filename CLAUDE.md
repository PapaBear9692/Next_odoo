# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Better Odoo is a complete headless Odoo setup with a custom web UI built on Next.js. Odoo 19 CE runs purely as a backend — no web frontend, no Odoo web modules loaded. The Next.js app is the sole user interface, communicating with Odoo exclusively through its JSON-RPC API. The goal is to build a custom frontend for **every core Odoo app** and **every feature** those apps provide.

## Repository Structure

- **`odoo-19/`** — Full Odoo 19.0 CE source (Python). Framework core in `odoo/`, all official addon modules in `addons/`.
- **`next-odoo/`** — Next.js 16 frontend (React 19, TypeScript, Tailwind CSS 4). App Router under `app/`. This is where all development happens.

## Odoo Backend (`odoo-19/`)

Odoo serves as a headless API server. We do not modify Odoo source code — we consume its JSON-RPC API.

### Commands

```bash
# Start the Odoo server (requires PostgreSQL)
python3 odoo-19/odoo-bin -c <config_file>

# Run tests for a specific module
python3 odoo-19/odoo-bin --test-enable -d <db_name> -i <module_name> --stop-after-init

# Scaffold a new module
python3 odoo-19/odoo-bin scaffold <module_name> <destination>

# Open Odoo shell
python3 odoo-19/odoo-bin shell -d <db_name>
```

### Key Details

- **Python 3.10–3.14** required; **PostgreSQL 13+** required.
- **Dependencies**: pinned in `requirements.txt` per Python version.
- **Module structure**: each addon in `addons/` has `__manifest__.py`, models (`models/`), views (`views/`), security (`security/`), data files (`data/`), controllers, and tests.
- **ORM**: models extend `odoo.models.Model`; fields via `odoo.fields`.
- **Controllers**: extend `odoo.http.Controller` — this is how JSON-RPC endpoints are exposed.
- **Linter**: `ruff` with config in `ruff.toml`. Target Python 3.10+.

### Core Apps in `odoo-19/addons/`

The `addons/` folder contains all core Odoo modules. The frontend must cover the major ones including (but not limited to): `account` (accounting), `sale` (sales), `purchase` (purchases), `stock` (inventory), `crm`, `project`, `hr` (employees), `website`, `ecommerce`, `point_of_sale`, `mrp` (manufacturing), `mass_mailing` (marketing), and their dependent modules.

## Next.js Frontend (`next-odoo/`)

This is the primary codebase where all UI development happens.

### Commands

```bash
cd next-odoo

npm install       # Install dependencies
npm run dev       # Development server (http://localhost:3000)
npm run build     # Production build
npm start         # Start production server
npm run lint      # ESLint
```

### Architecture

- **Next.js 16** with App Router, React 19, TypeScript 5, Tailwind CSS 4.
- Path alias: `@/*` maps to project root.
- Uses Geist font family (sans + mono). Dark mode via `prefers-color-scheme`.
- ESLint: `eslint-config-next` (core-web-vitals + TypeScript).

## Integration: Odoo JSON-RPC API

All data flows through Odoo's JSON-RPC API at `<odoo_host>/jsonrpc`. The Next.js app calls Odoo endpoints for authentication (`web/session/authenticate`), data CRUD (`web/dataset/call_kw`, `web/dataset/search_read`), actions (`web/action/load`), and all business operations. The Odoo server must be configured to run without its web frontend — the Next.js app replaces it entirely.
