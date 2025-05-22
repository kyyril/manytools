import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">ManyTools</h3>
            <p className="text-muted-foreground text-sm">
              AI-powered text tools to enhance your writing experience.
            </p>
            <div className="flex space-x-4">
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </Link>
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Tools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools/paraphrase" className="text-muted-foreground hover:text-primary">
                  Paraphrase Text
                </Link>
              </li>
              <li>
                <Link href="/tools/summarize" className="text-muted-foreground hover:text-primary">
                  Summarize Text
                </Link>
              </li>
              <li>
                <Link href="/tools/resume" className="text-muted-foreground hover:text-primary">
                  Resume Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/grammar" className="text-muted-foreground hover:text-primary">
                  Grammar Checker
                </Link>
              </li>
              <li>
                <Link href="/tools/plagiarism" className="text-muted-foreground hover:text-primary">
                  Plagiarism Check
                </Link>
              </li>
              <li>
                <Link href="/tools/ai-detector" className="text-muted-foreground hover:text-primary">
                  AI Detector
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-primary">
                  Cookies Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-4">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ManyTools. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;