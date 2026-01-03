# Francisco Alfaro - Modern Portfolio

A modern, responsive portfolio website built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**. Featuring smooth animations with Framer Motion and beautiful component-based architecture.

## Features

✨ **Modern Design**
- Responsive layout that works perfectly on mobile, tablet, and desktop
- Dark mode support
- Smooth animations and transitions with Framer Motion

🚀 **Performance**
- Built with Next.js 16 for optimal performance
- Server-side rendering and static generation
- Optimized images and code splitting

📱 **Mobile-Friendly**
- Fully responsive design
- Touch-friendly navigation
- Optimized for all screen sizes
- Proper scrolling on all devices

🎨 **Project Gallery**
- Showcase of Misc Projects (14 projects)
- Web3 & Blockchain Projects (5 projects)
- Beautiful project cards with hover effects
- Direct links to live projects

📄 **Pages**
- **Home**: Hero section with featured project categories
- **Misc Projects**: Grid view of all miscellaneous projects
- **Web3 Projects**: Showcase of blockchain-based applications
- **About**: Skills, experience, and biography
- **Contact**: Contact form and social media links

## Technology Stack

- **Frontend**: Next.js 16, React, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Utilities**: clsx for conditional styling

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
app/
├── page.tsx                 # Home page
├── layout.tsx              # Root layout with navigation
├── globals.css             # Global styles
├── misc/
│   └── page.tsx           # Misc projects page
├── web3/
│   └── page.tsx           # Web3 projects page
├── about/
│   └── page.tsx           # About page
└── contact/
    └── page.tsx           # Contact page

components/
├── Navigation.tsx         # Main navigation component
├── ProjectCard.tsx        # Reusable project card
└── PageLayout.tsx         # Page wrapper component

lib/
└── projects.ts           # Project data and types
```

## Responsive Design Highlights

### Mobile Optimization (< 640px)
- Vertical navigation layout
- Stacked grid layouts (1 column)
- Full-width project cards
- Touch-friendly buttons (min 44px height)
- Proper text sizing for readability

### Tablet (640px - 1024px)
- Adaptive navigation
- 2-column project grids
- Balanced spacing
- Optimized images

### Desktop (> 1024px)
- Fixed 320px sidebar navigation
- 3-column project grids
- Enhanced hover effects
- Optimized for large screens

## Features Implementation

### ✅ Scrollable Project Grid
- Projects display correctly on all screen sizes
- No overflow or layout breaks
- Smooth scrolling behavior
- Proper spacing between items

### ✅ Responsive Project Cards
- Images scale with screen size
- Descriptions fully visible
- Hover effects on desktop
- Touch-friendly on mobile

### ✅ Navigation System
- Fixed sidebar on desktop
- Vertical menu on mobile
- Active page indicators
- Quick access to social profiles

### ✅ Smooth Animations
- Page entry animations
- Card hover effects
- Staggered list animations
- Smooth transitions

## Environment Variables

No required environment variables. Optional for future features:

```bash
# .env.local
NEXT_PUBLIC_API_URL=your_api_url
```

## Deployment Options

### Vercel (Recommended)
```bash
# Build and prepare for deployment
npm run build

# Deploy using Vercel CLI
npx vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Static Export
```bash
npm run build
# .next folder contains static files
```

## Performance Metrics

- ⚡ Fast initial load time
- 🎯 Optimized Core Web Vitals
- 📦 Minimal bundle size (~50KB gzipped)
- 🖼️ Optimized image handling
- 🔍 SEO-friendly structure

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Android Chrome

## Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Build errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Image not loading
Check the image path in `lib/projects.ts` and ensure the file exists in the `public` folder.

## Future Enhancements

- [ ] Blog section with MDX support
- [ ] Dark mode toggle
- [ ] Search functionality for projects
- [ ] Comment system
- [ ] Analytics integration
- [ ] Newsletter signup
- [ ] Project filtering and tags
- [ ] CMS integration

## Development Tips

### Adding New Projects
Edit `lib/projects.ts` and add to `miscProjects` or `web3Projects` array:

```typescript
{
  id: 'unique-id',
  title: 'Project Title',
  description: 'Project description',
  link: 'https://project-url.com',
  image: 'img/project-image.jpg',
  category: 'misc' | 'web3',
}
```

### Customizing Styles
Edit `app/globals.css` or modify Tailwind classes in component files.

### Adding New Pages
Create new folder in `app/` with `page.tsx`:

```bash
mkdir app/blog
# Create app/blog/page.tsx
```

## License

Open source - feel free to use as reference or template

## Contact

- **Email**: falfaro105@gmail.com
- **GitHub**: [@RelegatedLeader](https://github.com/RelegatedLeader)
- **LinkedIn**: [@falfaro105](https://www.linkedin.com/in/falfaro105)
- **Portfolio**: [relegatedleader.github.io](https://relegatedleader.github.io)

---

Built with ❤️ by Francisco Alfaro  
Modernized with Next.js 16 for optimal performance and mobile responsiveness
