# How Do You Measure A Year?

A visual journal application that displays your year as a grid of days, similar to GitHub's contribution graph. Add photos or text memories to each day, with custom colors for text entries.

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS**
- **Vercel Postgres** (Database)
- **Vercel Blob Storage** (Photo storage)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory with your Vercel Postgres and Blob Storage credentials:

```env
# Vercel Postgres
POSTGRES_URL="your-postgres-url"
POSTGRES_PRISMA_URL="your-prisma-url"
POSTGRES_URL_NO_SSL="your-no-ssl-url"
POSTGRES_URL_NON_POOLING="your-non-pooling-url"
POSTGRES_USER="your-user"
POSTGRES_HOST="your-host"
POSTGRES_PASSWORD="your-password"
POSTGRES_DATABASE="your-database"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="your-blob-token"
```

You can get these credentials from:
- **Postgres**: Your existing Vercel Postgres instance (from personal_library project)
- **Blob Storage**: Create a new Blob store in your Vercel project settings

### 3. Set Up Database

First, install tsx to run the setup script:

```bash
npm install -D tsx
```

Then run the database setup:

```bash
npx tsx scripts/setup-db.ts
```

This will create the `day_entries` table in your database.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Features

- **Year Grid View**: See all 365 days at once, organized by month
- **Mobile Responsive**: Adapts to different screen sizes (7 cols on mobile, 20 on desktop)
- **Two Entry Types**:
  - **Text Memories**: Add text with custom color backgrounds
  - **Photos**: Upload and display photos for each day
- **Easy Editing**: Click any day to add, edit, or delete entries
- **Year Selector**: Switch between different years

## Project Structure

```
hdymay/
├── app/
│   ├── api/
│   │   ├── entries/          # API routes for CRUD operations
│   │   └── upload/           # Photo upload endpoint
│   ├── components/
│   │   ├── ColorPalette.tsx  # Color picker for text entries
│   │   ├── DayModal.tsx      # Modal for adding/editing entries
│   │   ├── DayTile.tsx       # Individual day tile
│   │   ├── YearGrid.tsx      # Main grid component
│   │   └── YearSelector.tsx  # Year dropdown selector
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Main page
├── lib/
│   ├── constants.ts          # Colors and month names
│   └── db.ts                 # Database utilities
├── types/
│   └── index.ts              # TypeScript types
└── scripts/
    └── setup-db.ts           # Database setup script
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add your environment variables in Vercel project settings
4. Deploy!

The database setup will need to be run once after deployment. You can do this by:
- Running the setup script locally with your production credentials, OR
- Adding a one-time API route that calls the setup function

## Future Enhancements

Potential features to add:
- Multi-user support with authentication
- Export year as image/PDF
- Search and filter entries
- Tags and categories
- Photo thumbnails for better performance
- Year themes and customization

## License

MIT
