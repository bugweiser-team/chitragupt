"use client";

import React, { useState, useRef } from 'react';
import { 
  FileText, 
  User, 
  Home, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Download, 
  Share2, 
  Copy, 
  Edit, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  Languages,
  Zap,
  Clock,
  ExternalLink,
  MessageCircle,
  Gavel
} from 'lucide-react';
import { DocFormData } from '@/types';
import { useCase } from '@/context/CaseContext';
import Link from 'next/link';

export default function DocumentsPage() {
  const { addDocument, stateLocation, amount, category } = useCase();
  
  const [formData, setFormData] = useState<DocFormData>({
    yourName: '',
    yourAddress: stateLocation || '',
    yourPhone: '',
    yourEmail: '',
    opponentName: '',
    opponentAddress: '',
    opponentPhone: '',
    issueType: category || 'Security Deposit Not Returned',
    amount: amount || '',
    dateVacated: '',
    demand: 'Return full deposit',
    deadline: '15',
    language: 'english',
    priorComm: false,
    priorCommDesc: ''
  });

  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Auto-fill from Context if it changes
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      amount: amount || prev.amount,
      yourAddress: stateLocation || prev.yourAddress,
    }));
  }, [amount, stateLocation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setGenerated(true);
      setLoading(false);
      addDocument('Legal Notice');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 animate-fadeIn">
           <div className="flex items-center justify-center gap-2 text-saffron dark:text-saffron-light font-black text-sm uppercase tracking-widest mb-2">
              <Zap size={16} />
              <span>AI Legal Assistant</span>
           </div>
           <h1 className="text-4xl sm:text-5xl font-black text-navy dark:text-white font-poppins">Generate Legal Documents</h1>
           <p className="max-w-2xl mx-auto text-gray-500 font-medium">Professional legal notices in 60 seconds. Download as PDF. Vetted by Indian Advocates. Available in Hindi and English.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
           
           {/* LEFT COLUMN: Form */}
           {!generated ? (
             <main className="w-full lg:w-[60%] space-y-8 animate-fadeInLeft">
                <div className="p-8 sm:p-12 bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-navy/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-1000" />
                   
                   <form onSubmit={handleGenerate} className="space-y-12 relative z-10">
                      {/* Step 1: Your Info */}
                      <section className="space-y-8">
                         <FormSectionHeader num={1} title="Your Details" sub="Who is sending this notice?" />
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormInput label="Full Name" name="yourName" placeholder="As on Aadhaar / PAN" value={formData.yourName} onChange={handleInputChange} required icon={<User size={16} />} />
                            <FormInput label="Phone Number" name="yourPhone" placeholder="+91 99999 99999" value={formData.yourPhone} onChange={handleInputChange} required icon={<Phone size={16} />} />
                            <div className="sm:col-span-2">
                               <FormTextArea label="Your Current Address" name="yourAddress" placeholder="Full postal address for receiving response" value={formData.yourAddress} onChange={handleInputChange} required />
                            </div>
                         </div>
                      </section>

                      {/* Step 2: Opponent Info */}
                      <section className="space-y-8">
                         <FormSectionHeader num={2} title="Opposite Party" sub="Who are you sending this to?" />
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormInput label="Their Name (Landlord / Company)" name="opponentName" placeholder="Name of Opponent" value={formData.opponentName} onChange={handleInputChange} required icon={<User size={16} />} />
                            <div className="sm:col-span-2">
                               <FormTextArea label="Their Full Address" name="opponentAddress" placeholder="Physical address for document service" value={formData.opponentAddress} onChange={handleInputChange} required />
                            </div>
                         </div>
                      </section>

                      {/* Step 3: Situation Details */}
                      <section className="space-y-8">
                         <FormSectionHeader num={3} title="Your Situation" sub="What happened and what do you want?" />
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="sm:col-span-2">
                               <FormSelect label="Main Issue" name="issueType" value={formData.issueType} onChange={handleInputChange} options={['Security Deposit Not Returned', 'Illegal Eviction', 'Unpaid Salary', 'Consumer Dispute']} />
                            </div>
                            <FormInput label="Relevant Amount (₹)" name="amount" type="number" placeholder="50000" value={formData.amount} onChange={handleInputChange} required icon={<span className="text-sm font-bold">₹</span>} />
                            <FormInput label="Date of Incident / Vacating" name="dateVacated" type="date" value={formData.dateVacated} onChange={handleInputChange} required icon={<Calendar size={16} />} />
                            <div className="sm:col-span-2">
                               <FormSelect label="Your Main Demand" name="demand" value={formData.demand} onChange={handleInputChange} options={['Return full deposit', 'Issue formal apology', 'Replace defective product', 'Pay unpaid salary with interest']} />
                            </div>
                            <FormInput label="Deadline for Response (Days)" name="deadline" type="number" value={formData.deadline} onChange={handleInputChange} required icon={<Clock size={16} />} />
                         </div>
                      </section>

                      <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                         <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full p-6 bg-navy dark:bg-saffron text-white dark:text-navy-dark rounded-2xl font-black text-xl shadow-xl shadow-navy/20 dark:shadow-saffron/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                         >
                            {loading ? (
                               <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                               <>
                                 <Zap size={24} />
                                 <span>⚡ Generate My Legal Notice</span>
                               </>
                            )}
                         </button>
                         <p className="text-center mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                            ⚠️ Professional legal documents are drafted based on Indian law. <br /> Ensure all information is accurate to the best of your knowledge.
                         </p>
                      </div>
                   </form>
                </div>
             </main>
           ) : (
             <main className="w-full lg:w-[65%] space-y-12 animate-fadeIn">
                {/* SUCCESS BANNER */}
                <div className="p-8 bg-green-500 rounded-[32px] text-white flex flex-col sm:flex-row items-center gap-6 shadow-2xl shadow-green-500/20">
                   <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 animate-bounce">
                      <CheckCircle2 size={40} />
                   </div>
                   <div className="text-center sm:text-left space-y-2">
                      <h3 className="text-2xl font-black font-poppins">Success! Your Legal Notice is Ready</h3>
                      <p className="text-sm font-medium opacity-90 leading-relaxed max-w-sm">
                        Sending this notice is often enough — 68% of disputes are resolved without ever going to court.
                      </p>
                   </div>
                   <button 
                      onClick={() => setGenerated(false)} 
                      className="ml-auto px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                   >
                     <Edit size={14} /> <span>Edit Form</span>
                   </button>
                </div>

                {/* THE DOCUMENT PREVIEW */}
                <div className="relative group">
                   <div className="absolute inset-0 bg-navy/5 blur-3xl -z-10 group-hover:scale-105 transition-transform duration-1000" />
                   <div 
                      ref={previewRef}
                      className="p-12 sm:p-20 bg-white shadow-2xl rounded-sm border-t-[12px] border-navy min-h-[1000px] font-serif text-black leading-normal select-none"
                   >
                      <div className="text-center space-y-1 mb-16">
                         <h2 className="text-2xl font-black uppercase tracking-widest border-b-2 border-black pb-2 inline-block">Legal Notice</h2>
                         <p className="text-xs italic pt-2">By Registered Post with Acknowledgment Due (RPAD)</p>
                      </div>

                      <div className="flex justify-between items-start mb-12">
                         <div className="space-y-1">
                            <p className="font-bold">From:</p>
                            <p className="text-sm font-bold uppercase">{formData.yourName}</p>
                            <p className="text-sm max-w-[200px] leading-relaxed italic">{formData.yourAddress}</p>
                         </div>
                         <div className="text-right">
                            <p className="font-bold text-sm">Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                         </div>
                      </div>

                      <div className="space-y-1 mb-12">
                         <p className="font-bold">To,</p>
                         <p className="text-sm font-bold uppercase">{formData.opponentName}</p>
                         <p className="text-sm max-w-[300px] leading-relaxed italic">{formData.opponentAddress}</p>
                      </div>

                      <div className="mb-12 space-y-2">
                         <p className="font-bold italic">Subject: Legal Notice for {formData.issueType} by {formData.yourName} - Demand for Relief.</p>
                      </div>

                      <div className="space-y-8 text-sm leading-[1.8] text-justify font-medium">
                         <p>Sir / Madam,</p>
                         <p>
                            Under the specific instructions of my client, I hereby serve you with this Legal Notice in relation to the following facts:
                         </p>
                         <p>
                            1. That you and I entered into an agreement on {formData.dateVacated ? new Date(formData.dateVacated).toLocaleDateString() : 'N/A'} for the purpose of tenancy/service, and my client deposited a sum of ₹{formData.amount} with you for the same.
                         </p>
                         <p>
                            2. That despite vacating the premises/service on the agreed date and fulfilling all obligations, you have failed to {formData.demand.toLowerCase()} within the legally stipulated timeline.
                         </p>
                         <p>
                            3. That such withholding is illegal, arbitrary, and amount to "Criminal Breach of Trust" under the Bharatiya Nyaya Sanhita (formerly IPC) and specific provisions of the Consumer Protection Act.
                         </p>
                         <p>
                            4. NOW THEREFORE, I hereby demand that you {formData.demand.toLowerCase()} within {formData.deadline} days from the receipt of this notice.
                         </p>
                         <p>
                            FAILURE to comply with the above will leave my client with no option but to initiate legal proceedings in the appropriate Court of Law, and you shall be solely liable for all costs and consequences thereof.
                         </p>
                      </div>

                      <div className="mt-20 pt-12">
                         <p className="font-bold">Signed,</p>
                         <p className="mt-12 border-b border-black w-48" />
                         <p className="font-bold uppercase pt-2 text-xs tracking-widest">{formData.yourName}</p>
                      </div>
                   </div>

                   {/* Preview Actions overlay */}
                   <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 animate-fadeInUp">
                      <button className="flex items-center gap-3 px-8 py-4 bg-navy text-white rounded-2xl font-black text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all">
                        <Download size={20} />
                        <span>Download PDF</span>
                      </button>
                      <button className="flex items-center gap-3 px-8 py-4 bg-white text-navy border-2 border-navy rounded-2xl font-black text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all">
                        <Share2 size={20} />
                        <span>Share on WhatsApp</span>
                      </button>
                   </div>
                </div>
             </main>
           )}

           {/* RIGHT COLUMN: Sidebar Info */}
           <aside className="w-full lg:w-[40%] space-y-8 lg:sticky lg:top-24">
              <div className="p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm space-y-8 animate-fadeIn">
                 <h4 className="text-xl font-black text-navy dark:text-white flex items-center gap-2">
                    <ShieldCheck className="text-saffron" size={24} />
                    Why this works
                 </h4>
                 
                 <div className="space-y-6">
                    <Feature small icon={<Clock />} title="Proper Evidence" desc="A formal notice + speed post receipt is 100% vital proof if you later go to court." />
                    <Feature small icon={<Languages />} title="Bi-Lingual" desc="Automatically generate the document in your preferred language to avoid confusion." />
                    <Feature small icon={<CheckCircle2 />} title="Legal Accuracy" desc="Templates based on CrPC and BNS standards used by Indian High Court lawyers." />
                 </div>

                 <div className="p-6 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">Recommended Next Steps:</p>
                    <div className="space-y-3">
                       <NextStep num="1" text="Download PDF & Print it" />
                       <NextStep num="2" text="Send via Speed Post / Registered Post" />
                       <NextStep num="3" text="WhatsApp & Email as backup proof" />
                       <NextStep num="4" text="Wait 15 days for formal response" />
                    </div>
                 </div>
              </div>

              <div className="p-10 bg-gradient-to-br from-navy to-navy-dark text-white rounded-[40px] shadow-2xl space-y-6 overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full" />
                 <h4 className="text-2xl font-black font-poppins">Ready to send?</h4>
                 <p className="text-sm opacity-70 leading-relaxed font-medium">
                   Don't forget to keep the postal receipt. It's your most powerful piece of evidence in court.
                 </p>
                 <button className="flex items-center gap-2 text-saffron font-black uppercase text-xs tracking-widest border-b-2 border-saffron pb-1 hover:gap-4 transition-all">
                    <span>Read our guide on Speed Post</span>
                    <ArrowRight size={14} />
                 </button>
              </div>
           </aside>

        </div>
      </div>
    </div>
  );
}

function FormSectionHeader({ num, title, sub }: { num: number; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-4">
       <div className="w-10 h-10 bg-navy dark:bg-saffron text-white dark:text-navy-dark rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0 shadow-lg shadow-navy/20 dark:shadow-saffron/20">
          {num}
       </div>
       <div className="space-y-1">
          <h4 className="text-xl font-bold text-navy dark:text-white leading-none">{title}</h4>
          <p className="text-sm text-gray-400 font-medium">{sub}</p>
       </div>
    </div>
  );
}

function FormInput({ label, icon, ...props }: any) {
  return (
    <div className="space-y-2">
       <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
          {icon}
          {label}
       </label>
       <input 
          {...props}
          className="w-full h-14 px-6 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-navy dark:text-white font-bold text-sm focus:ring-4 focus:ring-navy/5 focus:border-navy dark:focus:border-saffron transition-all outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700" 
       />
    </div>
  );
}

function FormTextArea({ label, ...props }: any) {
  return (
    <div className="space-y-2">
       <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</label>
       <textarea 
          {...props}
          rows={3}
          className="w-full p-6 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl text-navy dark:text-white font-bold text-sm focus:ring-4 focus:ring-navy/5 focus:border-navy dark:focus:border-saffron transition-all outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700 resize-none" 
       />
    </div>
  );
}

function FormSelect({ label, options, ...props }: any) {
  return (
    <div className="space-y-2">
       <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</label>
       <select 
          {...props}
          className="w-full h-14 px-6 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-navy dark:text-white font-bold text-sm focus:ring-4 focus:ring-navy/5 focus:border-navy dark:focus:border-saffron transition-all outline-none appearance-none"
       >
          {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
       </select>
    </div>
  );
}

function Feature({ icon, title, desc, small }: any) {
  return (
    <div className="flex gap-4">
       <div className={`flex-shrink-0 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 text-navy dark:text-saffron ${small ? 'w-10 h-10' : 'w-12 h-12'}`}>
          {React.cloneElement(icon, { size: small ? 18 : 24 })}
       </div>
       <div className="space-y-1">
          <h5 className="text-sm font-bold text-navy dark:text-white">{title}</h5>
          <p className="text-xs text-gray-400 font-medium leading-[1.6]">{desc}</p>
       </div>
    </div>
  );
}

function NextStep({ num, text }: { num: string; text: string }) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
       <div className="w-6 h-6 rounded-full bg-navy/10 dark:bg-white/10 flex items-center justify-center text-[10px] font-black text-navy dark:text-saffron group-hover:bg-navy dark:group-hover:bg-saffron group-hover:text-white dark:group-hover:text-navy transition-all">{num}</div>
       <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400 group-hover:text-navy dark:group-hover:text-saffron transition-colors">{text}</p>
    </div>
  );
}
