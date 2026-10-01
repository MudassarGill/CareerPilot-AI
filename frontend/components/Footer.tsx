import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full bg-[#1C1C1E] border-t border-[#2C2C2E] py-8 text-zinc-400 mt-auto">
            <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col items-center md:items-start gap-1">
                    <span className="font-sora font-semibold text-white tracking-tight flex gap-1">
                        CAREER
                        <span className="text-[#1EA7E8]">PLOT</span>
                    </span>
                    <p className="text-sm">© {new Date().getFullYear()} CareerPilot AI. All rights reserved.</p>
                </div>

                <div className="flex items-center gap-6 text-sm">
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                </div>

                <div className="flex items-center gap-4">
                    <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                    <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                    <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                </div>
            </div>
        </footer>
    );
}
