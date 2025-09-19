# 🎴 Flashcard Learning App

A modern, responsive flashcard application built with React, TypeScript, and Firebase. Features spaced repetition learning, rapid fire quizzes, and a beautiful Gruvbox dark theme with green highlights.

![Flashcard App](https://img.shields.io/badge/React-19.1.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue) ![Firebase](https://img.shields.io/badge/Firebase-12.3.0-orange) ![Vite](https://img.shields.io/badge/Vite-7.1.6-purple)

## ✨ Features

### 🎯 Core Functionality
- **Create & Manage Flashcards**: Add, edit, and delete flashcards with front and back content
- **3D Flip Animation**: Smooth card flipping with CSS 3D transforms
- **User Authentication**: Secure login with Firebase Auth (Email/Password & Google OAuth)
- **Real-time Sync**: All data synchronized across devices via Firestore

### 🧠 Spaced Repetition System
- **Flexible Revision Intervals**: Set custom review periods from seconds to months
- **Smart Scheduling**: Automatic calculation of next review dates
- **Visual Status Indicators**: Color-coded reminders for overdue, due today, and upcoming reviews
- **Review Tracking**: Monitor your learning progress with review counts

### ⚡ Rapid Fire Mode
- **Timed Quizzes**: Test your knowledge with time-limited questions
- **Score Tracking**: Real-time scoring system
- **Shuffled Questions**: Randomized order for better learning
- **Instant Feedback**: Immediate correct/incorrect responses

### 🎨 Beautiful UI/UX
- **Gruvbox Dark Theme**: Easy on the eyes with green accent highlights
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Glassmorphism Effects**: Modern frosted glass design elements
- **Accessibility**: High contrast text and keyboard navigation support

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd peer2peer/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore Database
   - Copy your Firebase config to `src/firebase.ts`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.tsx    # Main dashboard with flashcard grid
│   │   ├── Flashcard.tsx    # Individual flashcard component
│   │   ├── Login.tsx        # Authentication component
│   │   ├── Modal.tsx        # Modal dialog component
│   │   └── RapidFire.tsx    # Quiz mode component
│   ├── services/            # Firebase services
│   │   └── firestoreService.ts
│   ├── types/               # TypeScript type definitions
│   │   └── flashcard.ts
│   ├── utils/               # Utility functions
│   │   └── timeUtils.ts
│   ├── App.tsx              # Main application component
│   ├── firebase.ts          # Firebase configuration
│   └── index.css            # Global styles
├── package.json
└── README.md
```

## 🎮 Usage Guide

### Creating Flashcards
1. Click the **"Create New Flashcard"** button
2. Enter content for both front and back sides
3. Set your preferred revision interval (seconds to months)
4. Click **"Create Flashcard"**

### Managing Reviews
- **Green Cards**: Upcoming reviews
- **Yellow Cards**: Due today
- **Red Cards**: Overdue (with pulsing animation)
- Click **"Mark Reviewed"** to update your progress

### Rapid Fire Mode
1. Click the **"Rapid Fire"** button in the header
2. Answer questions within the time limit
3. View your final score and performance

### Customizing Revision Intervals
- Choose from: seconds, minutes, hours, days, weeks, months
- Set any number (1-999) for maximum flexibility
- Preview shows when your next review will be

## 🛠️ Technical Details

### Tech Stack
- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.6
- **Styling**: CSS3 with CSS Variables and 3D Transforms
- **Backend**: Firebase (Auth + Firestore)
- **State Management**: React Hooks (useState, useEffect)

### Key Features Implementation
- **3D Card Flip**: CSS `perspective`, `transform-style: preserve-3d`, `backface-visibility`
- **Spaced Repetition**: Custom algorithm with flexible time units
- **Real-time Updates**: Firestore listeners for live data sync
- **Responsive Design**: CSS Grid and Flexbox with mobile-first approach

### Performance Optimizations
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **Efficient Queries**: Firestore queries with proper indexing
- **CSS Animations**: Hardware-accelerated transforms

## 🎨 Theme Customization

The app uses a Gruvbox dark theme with CSS custom properties. Key colors:

```css
:root {
  --gruvbox-bg0: #282828;      /* Background */
  --gruvbox-bg1: #3c3836;      /* Lighter background */
  --gruvbox-fg1: #ebdbb2;      /* Foreground */
  --gruvbox-green: #b8bb26;    /* Primary accent */
  --gruvbox-red: #fb4934;      /* Error/overdue */
  --gruvbox-yellow: #fabd2f;   /* Warning/due today */
}
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Gruvbox Color Scheme**: [morhetz/gruvbox](https://github.com/morhetz/gruvbox)
- **Firebase**: Google's backend-as-a-service platform
- **React Team**: For the amazing React framework
- **Vite Team**: For the lightning-fast build tool

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include browser version, error messages, and steps to reproduce

---

**Happy Learning! 🎓✨**
