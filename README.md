# ManyTools - AI-Powered Text Tools & Makalah Builder

A comprehensive web application that provides AI-powered text processing tools and an intelligent academic paper (makalah) builder. Built with Next.js 15, TypeScript, and Google's Gemini AI.

## 🚀 Features

### AI Text Tools
- **Paraphrase Text**: Rewrite content while preserving meaning
- **Text Summarization**: Condense long content into concise summaries
- **Grammar Checker**: Fix grammar, spelling, and punctuation errors
- **Plagiarism Detection**: Verify text originality and detect potential plagiarism

### Makalah Builder (Academic Paper Generator)
- **Intelligent Structure Generation**: AI-powered chapter and sub-chapter creation
- **Chunk-by-Chunk Generation**: Generate content progressively with context awareness
- **Real-time Editing**: Built-in editor with live preview
- **Checkpoint System**: Auto-save and restore your work
- **Export Options**: Export to PDF, DOCX, or Markdown formats
- **Sample Data**: Load sample makalah for quick testing

### Core Features
- **Token-Based System**: Fair usage with free tokens and ad-based earning
- **Dark/Light Theme**: Responsive design with theme switching
- **Multilingual Support**: Full support for English and Indonesian
- **User Authentication**: Secure login with Supabase
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Notifications**: Toast notifications for user feedback

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **AI Integration**: Google Gemini AI API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: Zustand
- **Local Storage**: IndexedDB (idb-keyval)
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form with Zod validation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd many
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migrations in the `supabase/migrations` folder
   - Update the environment variables with your Supabase credentials

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
├── app/                    # Next.js 13+ App Router
│   ├── builder/           # Makalah builder page
│   ├── export/            # Export functionality
│   ├── history/           # Project history
│   ├── tools/             # AI text tools
│   │   ├── grammar/       # Grammar checker
│   │   ├── paraphrase/    # Text paraphrasing
│   │   ├── plagiarism/    # Plagiarism detection
│   │   └── summarize/     # Text summarization
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── home/             # Homepage components
│   ├── layout/           # Layout components
│   ├── tools/            # Tool-specific components
│   └── ui/               # UI components (Radix UI)
├── lib/                  # Utility libraries
│   ├── checkpoint.ts     # Checkpoint management
│   ├── gemini.ts         # Gemini AI integration
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # General utilities
├── hooks/                # Custom React hooks
├── data/                 # Sample data
└── supabase/            # Supabase configuration
```

## 🔧 Configuration

### Gemini AI Setup
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your `.env.local` file as `GEMINI_API_KEY`

### Supabase Setup
1. Create a new project at [Supabase](https://supabase.com)
2. Get your project URL and anon key
3. Add them to your `.env.local` file
4. Run the database migrations

## 📱 Usage

### Using AI Text Tools
1. Navigate to any tool from the homepage
2. Enter your text in the input area
3. Click the process button
4. Review and copy the results

### Building a Makalah
1. Go to the Builder page
2. Fill in the initial form (title, topic, chapter structure)
3. Click "Generate Initial Structure"
4. Use "Generate Next Chunk" to create content progressively
5. Edit content in the built-in editor
6. Save progress with checkpoints
7. Export when complete

### Managing Projects
1. View your project history
2. Load previous checkpoints
3. Continue working on saved projects
4. Export completed projects

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [Supabase](https://supabase.com/) for backend services

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](../../issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your setup and the issue

---

**Made with ❤️ using Next.js and AI**
