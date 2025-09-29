# 🎮 Solo Leveling MVP

A gamified Pomodoro timer app that turns productivity into an RPG-style leveling system. Track your focus sessions, level up attributes, and build skills with XP rewards and streak bonuses.

![Solo Leveling MVP](https://img.shields.io/badge/Status-MVP-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.3-38B2AC)

## 🚀 Features

### ⏰ Pomodoro Timer Engine
- **25/5/15 minute cycles**: 25-minute focus blocks with 5-minute short breaks and 15-minute long breaks
- **Streak validation**: Maintains focus streaks with intelligent pause/break rules
- **Session recovery**: Automatic persistence and recovery of interrupted sessions
- **Phase transitions**: Seamless switching between focus and break periods

### 🎯 XP & Leveling System
- **10 XP per focus minute**: Base XP rate for all focus time
- **Streak bonuses**: +100 XP per hour for hours 1-3
- **Accelerating returns**: 1.5× XP multiplier per hour from hour 4+
- **Dynamic leveling**: Attributes level up with increasing XP requirements (700 XP base, scaling by level bands)

### 🛠️ Skills & Attributes
- **Custom attributes**: Create and level up personal attributes (Strength, Intelligence, etc.)
- **Skill tracking**: Track hours spent building specific skills
- **Tiered progression**: Skill → Expertise → Mastery (20h → 100h → 1000h)
- **Attribute assignment**: Award XP to specific attributes during sessions

### 🎨 Gamified Interface
- **Mobile-first design**: 3-tab layout optimized for mobile and desktop
- **RPG aesthetics**: Progress bars, level badges, and achievement toasts
- **Real-time stats**: Live session tracking and XP calculations
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

### 📱 Offline-Ready PWA
- **Installable app**: Works on desktop and mobile devices
- **LocalStorage persistence**: No account required, data stored locally
- **Session recovery**: Automatic restoration of interrupted sessions
- **Cross-device sync**: (Future feature)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 18 + Tailwind CSS + shadcn/ui
- **State Management**: Custom React hooks + localStorage
- **Icons**: Lucide React
- **Charts**: Recharts
- **Deployment**: Optimized for Vercel

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/solo-leveling-mvp.git
   cd solo-leveling-mvp/app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🌍 Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Import the project into [Vercel](https://vercel.com)
3. Deploy automatically with zero configuration
4. Get a live URL (e.g., `https://solo-leveling.vercel.app`)

### Other Platforms

The app is a standard Next.js application and can be deployed to:
- Netlify
- Railway
- AWS Amplify
- Any Node.js hosting platform

## 🎮 How to Use

### Getting Started

1. **Create Attributes**: Go to the Profile tab and add custom attributes you want to level up
2. **Add Skills**: In the Skills tab, create skills you're working on (coding, fitness, etc.)
3. **Start a Session**: Use the Timer tab to begin a Pomodoro session
4. **Select Targets**: Choose which skill and attributes to award XP to
5. **Focus & Level Up**: Complete focus blocks to earn XP and level up!

### XP System Explained

- **Base XP**: 10 XP per minute of focus time
- **Streak Bonuses**: 
  - Hours 1-3: +100 XP per hour
  - Hours 4+: 1.5× multiplier per hour (exponential growth)
- **Level Requirements**: 700 XP base, increases by 700 per 5-level band

### Skill Progression

- **None** → **Skill**: 20 hours
- **Skill** → **Expertise**: 100 hours  
- **Expertise** → **Mastery**: 1000 hours

## 🏗️ Project Structure

```
app/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── tabs/             # Main tab components
│   ├── modals/           # Modal dialogs
│   └── ...               # Other components
├── hooks/                # Custom React hooks
│   └── use-app-state.ts  # Global state management
├── lib/                  # Core utilities
│   ├── types.ts          # TypeScript definitions
│   ├── timer-engine.ts   # Pomodoro timer logic
│   ├── xp-calculator.ts  # XP calculation system
│   ├── storage.ts        # localStorage management
│   └── utils.ts          # Utility functions
└── prisma/               # Database schema (future)
    └── schema.prisma
```

## 🔧 Development

### Key Components

- **`TimerEngine`**: Core Pomodoro timer with streak tracking
- **`XPCalculator`**: Complex XP calculation with bonuses and acceleration
- **`useAppState`**: Global state management hook
- **`StorageManager`**: LocalStorage persistence layer

### Adding New Features

1. **New Attributes**: Extend the `Attribute` interface in `types.ts`
2. **New Skills**: Add skill categories to `SKILL_CATEGORY_IMAGES`
3. **UI Components**: Use shadcn/ui components for consistency
4. **State Management**: Add new state to `useAppState` hook

### Code Style

- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Component-based architecture
- Custom hooks for state management
- Utility-first CSS with Tailwind

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core Pomodoro timer
- ✅ XP and leveling system
- ✅ Skills and attributes
- ✅ Mobile-responsive UI
- ✅ LocalStorage persistence

### Phase 2 (Planned)
- [ ] User authentication
- [ ] Cloud data sync
- [ ] Advanced analytics
- [ ] Achievement system
- [ ] Social features

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Team challenges
- [ ] Integration with productivity tools
- [ ] Advanced streak mechanics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the Solo Leveling webtoon/manhwa
- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/<your-username>/solo-leveling-mvp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/<your-username>/solo-leveling-mvp/discussions)

---

**Ready to level up your productivity? Start your first Pomodoro session now! 🚀**


