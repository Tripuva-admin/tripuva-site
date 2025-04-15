# Tripuva - Group Travel Experience Platform

![Tripuva Banner](https://oahorqgkqbcslflkqhiv.supabase.co/storage/v1/object/public/package-assets/static%20assets/Top-Places-bg4.png)

## Overview

Tripuva is a modern travel platform that connects solo travelers with group travel experiences across India. Our platform focuses on creating memorable journeys where travelers start solo but end up as a squad ✨.

## Features

- **Curated Travel Packages**: Handpicked destinations across India
- **Real-time Availability**: Live tracking of available spots for each trip
- **Interactive UI**: Modern, responsive design with image carousels and detailed trip information
- **WhatsApp Integration**: Seamless booking process through WhatsApp
- **Admin Dashboard**: Complete package and booking management system
- **Dynamic Pricing**: Flexible pricing with advance payment options

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Deployment**: Render

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tripuva/tripuva-site.git
   cd tripuva-site
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_WHATSAPP_LINK=your_whatsapp_api_link
   VITE_WHATSAPP_NUMBER=your_whatsapp_number
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Project Structure

```
tripuva-site/
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React context providers
│   ├── lib/            # Utility functions and configurations
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind config
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
└── ...config files
```

## Key Components

- **TopPlaces**: Featured travel packages display
- **PackageDetail**: Detailed trip information and booking
- **AdminDashboard**: Package management interface
- **PackageModal**: Quick view of package details

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License

Copyright (c) 2024 Team Tripuva

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Contact

For any queries or support, please reach out through:
- WhatsApp: +91 93959 29602
- Email: tripuva@hmail.com

---

Built with ❤️ by Team Tripuva 