import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  HiSparkles, HiLightBulb, HiChartBar, HiShieldCheck, 
  HiDocumentReport, HiClock, HiStar, HiArrowRight,
  HiMoon, HiSun, HiCheck
} from 'react-icons/hi';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const features = [
    { icon: HiSparkles, title: 'AI-Powered Analysis', desc: 'Get comprehensive startup analysis powered by advanced AI models' },
    { icon: HiChartBar, title: 'SWOT Analysis', desc: 'Understand strengths, weaknesses, opportunities, and threats' },
    { icon: HiShieldCheck, title: 'Startup Score', desc: 'Receive a score out of 10 with detailed breakdown' },
    { icon: HiDocumentReport, title: 'Investor Pitch', desc: 'AI generates compelling investor pitch for your startup' },
    { icon: HiLightBulb, title: 'Smart Suggestions', desc: 'Get AI-generated names, taglines, and growth strategies' },
    { icon: HiClock, title: 'Save & Export', desc: 'Save reports and export as PDF for presentations' },
  ];

  const steps = [
    { num: '01', title: 'Create Your Idea', desc: 'Enter your startup details including industry, audience, and revenue model' },
    { num: '02', title: 'AI Analyzes', desc: 'Our AI engine evaluates your idea across multiple dimensions' },
    { num: '03', title: 'Get Results', desc: 'Receive a detailed report with scores, insights, and recommendations' },
  ];

  const testimonials = [
    { name: 'Alex Chen', role: 'CS Student, Stanford', text: 'StartupIQ helped me validate my capstone project idea and scored it 8/10. The investor pitch it generated was incredibly professional.' },
    { name: 'Priya Sharma', role: 'Founder, TechNova', text: 'The SWOT analysis was spot on. It identified risks I hadn\'t even considered. Saved me months of research.' },
    { name: 'Marcus Johnson', role: 'MBA Student, Wharton', text: 'I use StartupIQ for every business case analysis. The competitor insights are remarkably accurate.' },
  ];

  const pricing = [
    { name: 'Starter', price: 'Free', features: ['3 Startup Ideas', '2 AI Analyses/month', 'Basic SWOT', 'Community Support'], popular: false },
    { name: 'Pro', price: '$19', features: ['Unlimited Ideas', 'Unlimited Analyses', 'Full Reports', 'PDF Export', 'Priority Support'], popular: true },
    { name: 'Enterprise', price: '$49', features: ['Everything in Pro', 'Team Collaboration', 'API Access', 'Custom Models', 'Dedicated Support'], popular: false },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <HiSparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl gradient-text">StartupIQ AI</span>
            </Link>
            <div className="flex items-center gap-3">
              <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
                {darkMode ? <HiSun className="w-5 h-5 text-amber-400" /> : <HiMoon className="w-5 h-5 text-primary-500" />}
              </button>
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary text-sm py-2 px-4">Dashboard</Link>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                  <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        {/* Background gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 text-sm font-medium mb-6">
              <HiSparkles className="w-4 h-4" /> AI-Powered Startup Validation
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-4xl sm:text-5xl md:text-7xl font-heading font-black leading-tight mb-6"
          >
            Validate Your
            <span className="gradient-text block">Startup Ideas</span>
            With AI Intelligence
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10"
          >
            Get instant AI analysis with SWOT breakdown, market potential, competitor insights, 
            and investor-ready pitch — all in seconds.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link to={isAuthenticated ? '/ideas/new' : '/register'} className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
              Start Validating <HiArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="btn-secondary text-lg px-8 py-4">
              Learn More
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16"
          >
            {[
              { value: '10K+', label: 'Ideas Analyzed' },
              { value: '95%', label: 'Accuracy' },
              { value: '4.9★', label: 'User Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-heading font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">Features</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mt-2 mb-4">
              Everything You Need to <span className="gradient-text">Validate</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Powerful AI tools designed to help you evaluate, refine, and perfect your startup ideas.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="glass-card p-6 group cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mt-2">
              Three Simple <span className="gradient-text">Steps</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-heading font-bold text-xl mb-4">
                  {step.num}
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">{step.title}</h3>
                <p className="text-[var(--text-secondary)]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mt-2">
              Loved by <span className="gradient-text">Founders</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <HiStar key={j} className="w-5 h-5 text-amber-400" />
                  ))}
                </div>
                <p className="text-[var(--text-secondary)] mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mt-2 mb-4">
              Choose Your <span className="gradient-text">Plan</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricing.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card p-8 relative ${plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="font-heading font-bold text-xl mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-heading font-black">{plan.price}</span>
                  {plan.price !== 'Free' && <span className="text-[var(--text-muted)]">/month</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <HiCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block text-center py-3 rounded-xl font-semibold transition-all ${
                    plan.popular ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <HiSparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold gradient-text">StartupIQ AI</span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              © 2026 StartupIQ AI. Built with ❤️ for Entrepreneurs.
            </p>
            <div className="flex gap-6 text-sm text-[var(--text-muted)]">
              <a href="#" className="hover:text-primary-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary-500 transition-colors">Terms</a>
              <a href="#" className="hover:text-primary-500 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
