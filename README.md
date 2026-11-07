# FeetCode (Gada Electronics)

Welcome to **FeetCode**, a competitive coding tracking application built with a modern, darker aesthetic and premium pixelated visual effects.

## Project Overview

FeetCode is a web application designed to gamify competitive programming. It allows users to:
*   Link their Codeforces accounts.
*   Create and join challenges with friends.
*   Track progress and compete for "coins" (tokens).
*   Visualize submission heatmaps.

The project features a unique "liquid glass" UI style, pixelated fonts (VT323), and interactive background effects like the fluid splash cursor.

## Tech Stack

*   **Framework**: Next.js 14+ (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS, Vanilla CSS (for custom effects)
*   **Authentication**: Firebase Auth
*   **Backend**: Express.js (proxy for Codeforces API and game logic)
*   **Database**: MongoDB (via Mongoose)
*   **Animations**: Framer Motion, HTML5 Canvas (Splash Cursor, Fuzzy Text)

## Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   MongoDB instance (local or Atlas)
*   Firebase project (for authentication)

### Installation

1.  **Clone the repository** (if applicable).
2.  **Install Client Dependencies**:
    ```bash
    cd client
    npm install
    ```
3.  **Install Server Dependencies**:
    ```bash
    cd server
    npm install
    ```

### Running Locally

1.  **Start the Backend Server**:
    Navigate to the `server` directory and run:
    ```bash
    npm run dev
    # or
    node index.js
    ```
    Ensure your MongoDB URI is correctly set in `.env` (or default local).

2.  **Start the Frontend Client**:
    Navigate to the `client` directory and run:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Features & UI

*   **Splash Cursor**: A fluid simulation background that reacts to mouse movement.
*   **Fuzzy Text**: A dynamic, glitch-like text effect for headers.
*   **Liquid Glass**: modern, translucent button styles.
*   **Responsive Design**: Optimized for both desktop and mobile viewing with a dedicated mobile bottom navigation bar.

## PDF/Documentation

For a PDF version of this documentation or project details, you can print this page using your browser's "Print to PDF" feature. This README serves as the primary documentation source.


## Public dashboard demo

Open `/demo` to explore the FeetCode dashboard with fictional challenges and coins.
Creating and joining challenges updates browser memory for that visit. A reload resets
the demo. The demo does not require any backend or Firebase configuration.

To embed it, set `PORTFOLIO_ORIGIN` in the Vercel frontend project before redeploying
the `client` app. Use the portfolio's exact HTTPS origin (for example,
`https://portfolio.example`), including a port if applicable, without a path or
trailing slash. If the variable is unset, `/demo` still works directly and blocks all
framing. Every other route denies framing.

After redeploying, check that the final `/demo` response sends the expected CSP
`frame-ancestors` and has no host-level `X-Frame-Options` or additional CSP policy
that blocks the portfolio. If the portfolio has a `frame-src` policy, allow the
FeetCode frontend origin in that policy.
