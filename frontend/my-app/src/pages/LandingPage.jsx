import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, UserPlus, Droplets, Send, ArrowRight } from 'lucide-react';

// --- Data for the Features section ---
const features = [
    { icon: Wallet, title: "Secure Wallet Creation", description: "Generate a new, non-custodial wallet on the Solana devnet with a secure 12-word seed phrase." },
    { icon: UserPlus, title: "Multiple Accounts", description: "Create and manage multiple distinct accounts under a single wallet, each with its own public address." },
    { icon: Droplets, title: "Devnet SOL Airdrop", description: "Instantly fund any of your accounts with 1 DEV SOL directly from the dashboard to start testing." },
    { icon: Send, title: "Instant Transfers", description: "Seamlessly send SOL between accounts or to any other address on the Solana devnet with ease." }
];

// --- Animation Variants for Framer Motion ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};


// --- Navbar Component ---
const Navbar = () => {
    const navigate = useNavigate();
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 px-8 bg-black/30 backdrop-blur-sm"
        >
            <div className="text-xl font-bold tracking-wider text-white">SOLBANK</div>
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm font-semibold transition-colors text-gray-300 hover:text-white">Log In</button>
                <button onClick={() => navigate('/register')} className="px-4 py-2 text-sm rounded-lg backpack-button">Register</button>
            </div>
        </motion.nav>
    );
};

// --- Hero Section Component ---
const Hero = () => {
    const navigate = useNavigate();
    return (
        <section className="relative flex items-center justify-center min-h-screen px-4 text-center">
            <div className="hero-grid-glow"></div>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 flex flex-col items-center"
            >
                <motion.h1 variants={itemVariants} className="text-5xl font-extrabold tracking-wider text-white md:text-7xl hero-glow">
                    SOLBANK
                </motion.h1>
                <motion.p variants={itemVariants} className="max-w-2xl mx-auto mt-6 text-lg text-gray-300 md:text-xl">
                    Your Command Center for the Solana Ecosystem.
                </motion.p>
                <motion.p variants={itemVariants} className="max-w-xl mx-auto mt-4 text-sm text-gray-500">
                    A self-custody wallet built for speed, security, and power users. Take full control of your digital assets.
                </motion.p>
                <motion.div variants={itemVariants} className="mt-10">
                    <button onClick={() => navigate('/register')} className="flex items-center gap-2 px-8 py-4 text-lg font-bold rounded-lg backpack-button">
                        Create Your Vault <ArrowRight size={20} />
                    </button>
                </motion.div>
            </motion.div>
        </section>
    );
};

// --- Features Section Component ---
const Features = () => (
    <section className="w-full max-w-6xl px-4 py-24 mx-auto">
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
            {features.map((feature) => (
                <motion.div key={feature.title} variants={itemVariants} className="p-6 text-left transition-all duration-300 border border-transparent backpack-card hover:border-brand-red/50 hover:-translate-y-2">
                    <div className="flex items-center justify-center w-12 h-12 mb-5 rounded-lg bg-brand-red/10">
                        <feature.icon size={24} className="text-brand-red" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
                </motion.div>
            ))}
        </motion.div>
    </section>
);

// --- Footer Component ---
const Footer = () => (
    <footer className="w-full py-6 text-center border-t border-border-color/50">
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} SOLBANK. All Rights Reserved.</p>
    </footer>
);


// --- Main Landing Page Assembly ---
const LandingPage = () => {
  return (
    <div className="w-full font-mono landing-bg noise-background text-text-color">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;