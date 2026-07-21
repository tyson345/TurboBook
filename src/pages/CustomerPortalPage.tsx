import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Globe, Smartphone, Settings, TrendingUp, Palette, Lightbulb, Users, Target, Rocket, ShieldCheck, Clock, Award, ThumbsUp, Mail, Phone, MapPin, LogOut, Menu, X, CircleCheck as CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SERVICE_TYPES } from '../lib/excelStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const services = [
  { icon: Globe, title: 'Website Creation', desc: 'Modern, fast, responsive websites built with the latest tech.', color: 'from-blue-500 to-blue-700' },
  { icon: Smartphone, title: 'App Development', desc: 'Native and cross-platform mobile apps that users love.', color: 'from-purple-500 to-purple-700' },
  { icon: Settings, title: 'Management & Maintenance', desc: 'Ongoing support, updates, and monitoring for your products.', color: 'from-emerald-500 to-emerald-700' },
  { icon: TrendingUp, title: 'SEO / Marketing', desc: 'Get found by customers with data-driven SEO and campaigns.', color: 'from-orange-500 to-orange-700' },
  { icon: Palette, title: 'Branding & Design', desc: 'Logos, identity systems, and UI design that stands out.', color: 'from-pink-500 to-pink-700' },
  { icon: Lightbulb, title: 'Consultation', desc: 'Strategy sessions to turn your idea into a clear roadmap.', color: 'from-indigo-500 to-indigo-700' },
];

const howWeWork = [
  { icon: Target, step: '01', title: 'Discover', desc: 'We learn your business, goals, and audience to define the right scope.' },
  { icon: Rocket, step: '02', title: 'Design', desc: 'We craft wireframes and visuals, iterating with your feedback.' },
  { icon: Zap, step: '03', title: 'Build', desc: 'We develop with clean, tested code and regular progress demos.' },
  { icon: ShieldCheck, step: '04', title: 'Launch & Support', desc: 'We deploy, monitor, and keep things running smoothly.' },
];

const pros = [
  { icon: Clock, title: 'Fast Delivery', desc: 'Most projects ship in 2-4 weeks with weekly milestones.' },
  { icon: Award, title: 'Quality First', desc: 'Tested, accessible, and built to scale with your growth.' },
  { icon: ThumbsUp, title: 'Transparent', desc: 'Clear pricing, no surprises, and you own all the code.' },
  { icon: Users, title: 'Dedicated Team', desc: 'A real human point of contact throughout your project.' },
];

const insights = [
  { label: 'Projects Delivered', value: '240+', icon: Rocket },
  { label: 'Happy Clients', value: '180+', icon: Users },
  { label: 'Avg. Delivery Time', value: '3 wks', icon: Clock },
  { label: 'Client Retention', value: '94%', icon: Award },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CustomerPortalPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thanks! We will get back to you within 24 hours.');
    setContactForm({ name: '', email: '', message: '' });
  };

  const navLinks = [
    { id: 'services', label: 'Services' },
    { id: 'how-we-work', label: 'How We Work' },
    { id: 'why-us', label: 'Why Us' },
    { id: 'insights', label: 'Insights' },
    { id: 'contact', label: 'Contact' },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-700 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Turbo<span className="text-purple-700">Book</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-none">{user?.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">Customer</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase() ?? 'C'}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden border-t border-gray-100 dark:border-gray-800 px-4 py-3 space-y-2"
          >
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="block w-full text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-purple-700"
              >
                {l.label}
              </button>
            ))}
          </motion.nav>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 to-indigo-800 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-20 md:py-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-medium mb-4">
              Welcome, {user?.name?.split(' ')[0] ?? 'there'}!
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              We build digital products that grow your business
            </h1>
            <p className="mt-4 text-lg text-purple-100">
              From websites to apps to ongoing management — TurboBook is your one-stop partner for everything digital.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo('services')}
                className="px-6 py-3 rounded-xl bg-white text-purple-700 font-semibold text-sm hover:bg-purple-50 transition-colors"
              >
                Explore Services
              </button>
              <button
                onClick={() => scrollTo('contact')}
                className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors border border-white/30"
              >
                Get in Touch
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <motion.div variants={item} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Services</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Everything you need to launch and grow online.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <motion.div
                key={s.title}
                variants={item}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-card p-6 border border-gray-50 dark:border-gray-800"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4`}>
                  <s.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How We Work */}
      <section id="how-we-work" className="bg-white dark:bg-gray-900 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.div variants={item} className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How We Work</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">A simple, proven process from idea to launch.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {howWeWork.map((h) => (
                <motion.div key={h.step} variants={item} className="relative">
                  <div className="text-5xl font-bold text-purple-100 dark:text-purple-900/40 absolute -top-4 -left-2">
                    {h.step}
                  </div>
                  <div className="relative pt-6">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-4">
                      <h.icon className="h-6 w-6 text-purple-700 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{h.title}</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{h.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Us */}
      <section id="why-us" className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <motion.div variants={item} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Choose Us</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">The benefits of working with TurboBook.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pros.map((p) => (
              <motion.div
                key={p.title}
                variants={item}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-card p-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-4">
                  <p.icon className="h-7 w-7 text-purple-700 dark:text-purple-400" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">{p.title}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Insights */}
      <section id="insights" className="bg-gradient-to-br from-purple-700 to-indigo-800 text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.div variants={item} className="text-center mb-12">
              <h2 className="text-3xl font-bold">Company Insights</h2>
              <p className="mt-2 text-purple-100">Numbers that speak for themselves.</p>
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {insights.map((i) => (
                <motion.div
                  key={i.label}
                  variants={item}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20"
                >
                  <i.icon className="h-8 w-8 mx-auto mb-3 text-purple-200" />
                  <p className="text-3xl font-bold">{i.value}</p>
                  <p className="mt-1 text-sm text-purple-100">{i.label}</p>
                </motion.div>
              ))}
            </div>
            <motion.div variants={item} className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
              {SERVICE_TYPES.map((s) => (
                <div key={s} className="flex items-center gap-2 text-sm text-purple-100">
                  <CheckCircle2 className="h-4 w-4 text-purple-200 shrink-0" />
                  {s}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Let's Connect</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Tell us about your project and we'll get back to you within 24 hours.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-purple-700 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Email</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">hello@turbobook.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-purple-700 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Phone</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">+1 (555) 000-1234</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-purple-700 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Location</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">123 Tech Avenue, Suite 100, Remote</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleContactSubmit}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-card p-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Your Name</label>
              <input
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="Jane Doe"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Tell us about your project…"
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 resize-none"
              />
            </div>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm shadow-lg shadow-purple-700/30 transition-all"
            >
              Send Message
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center text-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-purple-500" />
            <span className="font-bold text-white">TurboBook</span>
          </div>
          <p>Building digital products that move your business forward.</p>
        </div>
      </footer>
    </div>
  );
}
