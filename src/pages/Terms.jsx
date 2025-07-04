import { motion } from 'framer-motion';
import { FaShieldAlt, FaFileContract, FaUserShield } from 'react-icons/fa';

const Terms = () => {
  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <FaFileContract className="text-4xl text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Terms of Use</h1>
          <p className="text-gray-400">Last Updated: March 2024</p>
        </motion.div>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">1. Acceptance of Terms</h2>
            <p>By accessing and using StreamFlix, you accept and agree to be bound by the terms and provisions of this agreement.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">2. Subscription</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your StreamFlix membership continues until terminated.</li>
              <li>To use the service, you must have Internet access and a StreamFlix-ready device.</li>
              <li>Subscription fees are charged at the beginning of your membership.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">3. Content Usage Rules</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Content is for personal, non-commercial use only</li>
              <li>You agree not to archive, download, reproduce, or distribute content</li>
              <li>Sharing account credentials is prohibited</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">4. Account Security</h2>
            <p>You are responsible for all activity that occurs under your account. Contact us immediately if you suspect unauthorized use.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">5. Termination</h2>
            <p>We may terminate or restrict your use of our service if you violate these Terms of Use or engage in illegal conduct.</p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-gray-850 rounded-xl">
          <h3 className="text-xl font-bold mb-4 text-white">Questions About Terms of Use?</h3>
          <p className="text-gray-400 mb-6">
            If you have any questions about our Terms of Use, please contact our support team.
          </p>
          <button className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Terms;