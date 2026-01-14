# 🏎️ Yoto Formula 1 Card Generator

A Next.js application that automatically creates and updates Yoto MYO (Make Your Own) cards with the latest Formula 1 race information. Perfect for F1 fans who want their Yoto players to announce upcoming races!

## ✨ Features

### Core Features

- 🏁 **Next Race Information** - Automatically fetches the next upcoming F1 race
- 🌍 **Timezone Conversion** - Displays race time in the user's local timezone based on IP address
- 🔄 **Auto-Update** - Updates the same card with new race info (no need to create new cards each time)
- 🎙️ **Text-to-Speech** - Uses ElevenLabs via Yoto Labs API to generate audio
- 🔐 **OAuth Authentication** - Secure authentication with Yoto (required before use)
- 📱 **Responsive Design** - Works on desktop and mobile devices

### Advanced Features

- 🖼️ **Custom Cover Images** - Automatically uploads cover art from `public/assets/card-images/`
- 📊 **Real-Time Job Status** - Live polling shows TTS generation progress (queued → processing → completed)
- 🎵 **Audio File Upload** - Upload your own audio files to create MYO-compatible cards
- 🔓 **Logout Functionality** - Easily logout and switch Yoto accounts
- 📡 **Device Deployment** - Automatically deploys to all connected Yoto devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A [Yoto Developer Account](https://yoto.dev/)
- Yoto OAuth credentials (Client ID & Secret)
- A physical Yoto MYO card (optional, for linking the playlist)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-github-username>/yoto-f1-card.git
   cd yoto-f1-card
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env` and fill in your Yoto credentials:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your credentials:

   ```env
   YOTO_CLIENT_ID=your_client_id_here
   YOTO_CLIENT_SECRET=your_client_secret_here
   ```

   **Note:** No need for `NEXT_PUBLIC_APP_URL` - the app auto-detects the correct URL at runtime!

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

### First Time Setup

1. **Connect with Yoto** - Click the "🔐 Connect with Yoto" button and authenticate
   - Authentication is required before you can use any features
   - Your session will persist across browser restarts
2. **Add Cover Image** (Optional) - Place an image named `countdown-to-f1-card.png` in `public/assets/card-images/`

### Generate TTS Card

1. **Generate Card** - Click "Generate F1 Card" to create your first card with text-to-speech
2. **Watch Progress** - Real-time status shows: Queued → Processing → Completed
3. **Check Your Library** - The card will appear in your Yoto library when complete
4. **Link to MYO Card** - Use the Yoto app to link the playlist to your physical MYO card
5. **Auto-Update** - Click "Generate F1 Card" again anytime to update with the latest race info!

### Upload Audio to MYO Card

1. **Prepare Audio** - Have an MP3, M4A, or WAV file ready
2. **Upload** - Use the "Upload Audio to MYO Card" form to select and upload your audio
3. **Wait for Processing** - The app will upload and transcode your audio (15-60 seconds)
4. **Link to MYO** - Follow the instructions to link the card in your Yoto app

### Logout

- Click the "Logout" button in the footer to disconnect your Yoto account
- You'll need to re-authenticate to use the app again

## 🎯 How Auto-Update Works

The first time you generate a card, the app:

- Creates a new playlist in your Yoto library
- Stores the card ID locally
- Returns the playlist information

On subsequent generations:

- Updates the **same** card with new race information
- No duplicate cards created
- Your MYO card automatically gets the latest data!

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Yoto OAuth 2.0
- **Data Sources**:
  - OpenF1 API for race data
  - ipapi.co for timezone detection
- **TTS**: Yoto Labs API with ElevenLabs
- **Storage**: Configstore for local token/card storage
- **Styling**: CSS Modules

## 📦 Deployment

### Deploy to Fly.io

1. **Install Fly CLI**

   ```bash
   brew install flyctl
   ```

2. **Login to Fly**

   ```bash
   fly auth login
   ```

3. **Launch your app**

   ```bash
   fly launch
   ```

4. **Set environment variables**

   ```bash
   fly secrets set YOTO_CLIENT_ID=your_client_id
   fly secrets set YOTO_CLIENT_SECRET=your_client_secret
   ```

5. **Deploy**

   ```bash
   fly deploy
   ```

6. **Set up automatic deployments (optional)**
   - Get your Fly API token: `fly auth token`
   - Add `FLY_API_TOKEN` to GitHub repository secrets
   - Every push to `main` branch will auto-deploy via GitHub Actions!

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yoto-dev/yoto-f1-card)

1. Click the deploy button above
2. Add your environment variables in Vercel dashboard
3. Deploy!

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 🐛 Troubleshooting

### "Not authenticated" error

- You must click "🔐 Connect with Yoto" before using any features
- If you see the login button, your session has expired - click it to re-authenticate
- Check that your OAuth credentials are correct in `.env`
- Make sure your Yoto app has both redirect URIs configured:
  - `http://localhost:3000/api/auth/callback` (local)
  - `https://your-domain.com/api/auth/callback` (production)

### Can't see the login button

- Click "Logout" in the footer to clear your session
- Alternatively, visit `http://localhost:3000/api/auth/logout`
- Refresh the page and the login button should appear

### Card not updating

- Watch the real-time status indicator - it shows: Queued → Processing → Completed
- TTS processing typically takes 10-30 seconds
- When status shows "✅ Completed", your card is ready in your Yoto library
- Check your Yoto library in the app

### Cover image not appearing

- Ensure image is named `countdown-to-f1-card.png` in `public/assets/card-images/`
- Supported formats: PNG or JPG
- Check console logs for upload confirmation

### MYO audio upload fails

- Ensure audio file is in a supported format (MP3, M4A, WAV)
- File size should be under 100MB
- Wait for transcoding to complete (usually 15-60 seconds)
- Check that you're authenticated with Yoto

### Race time showing wrong timezone

- The app auto-detects timezone from your IP
- If running locally, it may default to your server's timezone

### OAuth redirect issues on deployed app

- The app automatically detects the correct URL using request headers
- No configuration needed - works on Fly.io, Vercel, and other platforms
- If issues persist, check your Yoto app redirect URI matches your domain

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Yoto](https://yoto.dev/) for their amazing developer API
- [OpenF1](https://openf1.org/) for F1 data
- The F1 and Yoto communities

## 🔗 Links

- [Yoto Developer Portal](https://yoto.dev/)
- [Yoto Discord Community](https://discord.gg/FkwBpYf2CN)
- [OpenF1 API Documentation](https://openf1.org/)

---

Built with ❤️ for the Yoto community

## Customization

1. Modify `src/services/f1Service.js` to adjust data fetching
2. Update `src/app/page.js` to change the UI
3. Edit chapter scripts in the `generateF1Script` function

## Sharing with Yoto Community

Once your card is ready, follow the [Yoto Publishing Guidelines](https://yoto.dev/publishing/) to share it with the community.
