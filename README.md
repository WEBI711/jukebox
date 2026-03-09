# Jukebox

A collaborative Spotify music player built with Next.js. Create a room, invite friends, and listen to music together.

## Features

- Create music rooms with Spotify integration
- Search and queue songs from Spotify
- Real-time playlist updates via WebSocket
- Responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- Spotify Developer account

### Environment Variables

Create a `.env` file with:

```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify-login/callback
```

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/              # Next.js app router
    api/            # API routes
    room/           # Room page
  components/       # React components
  hooks/            # Custom React hooks
  modules/          # Core business logic
  types/            # TypeScript types
```

## License

MIT
