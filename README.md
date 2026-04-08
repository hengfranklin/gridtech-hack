# GridTech

🥈 **2nd Place Winner** — [Cross-Columbia GridTech Hackathon](https://cugridtechhackathon.com/)

🔗 **Live demo:** [gridtech.vercel.app](https://gridtech.vercel.app/)

![GridTech homepage](gridtech/docs/screenshots/homepage.png)

## Problem

New York's energy efficiency and demand response programs — Smartcharge NY, Smartcharge Commercial, SCERP, IRA 30C tax credits, and many others — are significantly underutilized. This underutilization strains the grid and leaves money on the table for consumers and businesses alike.

The main barriers we identified:
- **Lack of trust** in utilities
- **Long, opaque enrollment processes**
- **Low awareness** — people don't know what they're eligible for
- **Fragmented information** across dozens of programs

## Solution

GridTech is a web app that consolidates NY energy reward programs and makes them accessible to everyone. It:

- Surfaces programs users are eligible for based on their profile
- Automates enrollment and tracks progress
- Quantifies financial and energy savings
- Provides personalized recommendations based on location, building type, and grid zone
- Offers tailored experiences for different user types (residents, buildings, companies)
- Includes a **utility-side dashboard** to help utilities target underutilized programs, consolidate offerings, and address grid goals like congestion holistically
- Visualizes grid congestion and geospatial data where relevant

## Stack

- **Next.js 14** + React 18 + TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Leaflet / react-leaflet** for geospatial views
- **Zustand** for state management
- Deployed on **Vercel**

## Local Development

```bash
cd gridtech
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).
