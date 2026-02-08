# Sujeet KC - Portfolio Template

A modular, open-source portfolio template built with **Astro**, **React**, and **TypeScript**. Designed as a clean, performant foundation for developers to build and showcase their own technical identity.

🌐 **Live Demo**: [kcsujeet.com.np](https://kcsujeet.com.np)

## ✨ Features

- **Modern Tech Stack**: Built with Astro 5.8, React 19, and TypeScript
- **Responsive Design**: Fully responsive across all devices
- **Interactive Components**: Command palette, section navigation, and hover effects
- **Performance Optimized**: Fast loading with Astro's static site generation
- **SEO Friendly**: Built-in sitemap generation and meta tags

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/) - Static site generator
- **Frontend**: [React](https://reactjs.org/) - UI library
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Package Manager**: [Bun](https://bun.sh/) - Fast JavaScript runtime & package manager
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful SVG icons
- **UI Components**: [Radix UI](https://www.radix-ui.com/) - Headless UI components

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kcsujeet/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```

4. Open [http://localhost:5000](http://localhost:5000) in your browser

## 📜 Available Scripts

- **`bun run dev`** - Start development server
- **`bun run build`** - Build for production
- **`bun run preview`** - Preview production build locally

## 🏗️ Project Structure

```
src/
├── components/
│   ├── portfolio/          # Portfolio-specific components
│   │   ├── header.tsx      # Navigation header with command palette
│   │   ├── hero-section.tsx
│   │   ├── about-section.tsx
│   │   ├── experience-section.tsx
│   │   ├── projects-section.tsx
│   │   ├── contact-section.tsx
│   │   └── ...
│   └── ui/                 # Reusable UI components
├── layouts/
│   └── MainLayout.astro    # Main page layout
├── pages/
│   └── index.astro         # Home page
└── styles/
    └── global.css          # Global styles and animations
```

## 🎨 Key Features

### Command Palette
- **Desktop**: Traditional navigation bar with smooth scrolling
- **Mobile**: Compact command palette trigger (⌘K or Ctrl+K)
- **Keyboard Shortcuts**: Quick navigation with keyboard

### Sections
- **Hero**: Introduction with gradient backgrounds
- **About**: Skills showcase with staggered animations
- **Experience**: Professional timeline with hover effects
- **Projects**: Portfolio showcase with interactive cards
- **Contact**: Social links and contact information

## 🔧 Customization

1. **Personal Information**: Update content in each section component
2. **Styling**: Modify Tailwind classes or add custom CSS in `global.css`
4. **Colors**: Update the color scheme in Tailwind configuration

## 📝 Recent Updates

- ✅ Removed Framer Motion dependency for better performance
- ✅ Implemented CSS animations with Tailwind
- ✅ Added responsive navigation (traditional header + command palette)
- ✅ Enhanced hover effects and transitions
- ✅ Improved mobile responsiveness
- ✅ Added scroll progress indicator

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## ⭐ Support

If you found this project helpful, please consider giving it a star on GitHub!

---

**Built with ❤️ by [Sujeet KC](https://kcsujeet.com.np)**
