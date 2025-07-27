# Heritage Risk Assessment Dashboard

A comprehensive web application for managing and analyzing heritage site risk assessments, built with React, TypeScript, and Vite.

## Features

- **Site Management**: Add, edit, and manage heritage sites with detailed information
- **Risk Assessment**: Conduct comprehensive risk assessments using the ABC methodology
- **Analytics & Trends**: Analyze risk trends over time with interactive charts
- **Report Generation**: Generate standardized reports in multiple formats
- **Interactive Visualizations**: Charts, maps, and dashboards for data visualization
- **Data Export/Import**: Export and import data in various formats

## Live Demo

🌐 **[View Live Application](https://xbenedict.github.io/riskassessment)**

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/xbenedict/riskassessment.git
cd riskassessment
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run deploy` - Deploy to GitHub Pages

## Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Manual Deployment

To deploy manually to GitHub Pages:

```bash
npm run deploy
```

### Automatic Deployment

The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the main/master branch.

## Project Structure

```
src/
├── components/          # React components
│   ├── Analytics/       # Trend analysis components
│   ├── Reports/         # Report generation components
│   ├── RiskAssessment/  # Risk assessment forms and lists
│   ├── SiteManagement/  # Site management components
│   └── Visualization/   # Charts and data visualization
├── services/            # API and data services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global styles
```

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Chart.js** - Data visualization
- **Leaflet** - Interactive maps
- **CSS Modules** - Scoped styling
- **Vitest** - Testing framework

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built following ICCROM Heritage Risk Assessment Guidelines
- Designed for heritage conservation professionals
- Supports UNESCO World Heritage Site management practices