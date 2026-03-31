import Link from 'next/link';
import { Scale, Mail, Phone, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-gray-300 py-12 px-4 sm:px-6 lg:px-8 border-t border-navy">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                <Scale size={20} className="text-saffron" />
              </div>
              <span className="text-white text-xl font-bold font-poppins">Chitragupta</span>
            </Link>
            <p className="text-sm leading-relaxed opacity-70">
              India's first AI-powered Legal First-Response System. Legal aid for every Indian citizen, simplified.
            </p>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
               <Phone size={16} className="text-saffron" />
               <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold opacity-50">Legal Aid Helpline</span>
                  <span className="text-sm font-bold text-white tracking-widest leading-none">15100</span>
               </div>
            </div>
          </div>

          {/* Get Help */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-6 opacity-40">Get Help</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/get-help" className="hover:text-saffron transition-colors">Landlord Issues</Link></li>
              <li><Link href="/get-help" className="hover:text-saffron transition-colors">Consumer Rights</Link></li>
              <li><Link href="/get-help" className="hover:text-saffron transition-colors">Workplace Problems</Link></li>
              <li><Link href="/get-help" className="hover:text-saffron transition-colors">Police & FIR Help</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-6 opacity-40">Resources</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/documents" className="hover:text-saffron transition-colors">RTI Generator</Link></li>
              <li><Link href="/lawyers" className="hover:text-saffron transition-colors">Find a Lawyer</Link></li>
              <li><Link href="/get-help" className="hover:text-saffron transition-colors">Know Your Rights</Link></li>
              <li><a href="https://nalsa.gov.in" target="_blank" className="flex items-center gap-1 hover:text-saffron transition-colors">NALSA Website <ExternalLink size={12} /></a></li>
            </ul>
          </div>

          {/* Build Info */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-6 opacity-40">About</h4>
            <p className="text-sm opacity-70 mb-4">
              Built at Hack-A-Sprint 2026. Empowering citizens through accessible legal information.
            </p>
            <div className="text-[10px] opacity-40 space-y-1">
              <p>Powered by Claude AI + Sarvam AI</p>
              <p>© 2026 Chitragupta. All Rights Reserved.</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] opacity-50 tracking-wide font-medium">
          <p>⚠️ GENERAL INFORMATION ONLY. NOT LEGAL ADVICE.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:underline">Privacy Policy</Link>
            <Link href="/" className="hover:underline">Terms of Use</Link>
            <Link href="/" className="hover:underline">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
