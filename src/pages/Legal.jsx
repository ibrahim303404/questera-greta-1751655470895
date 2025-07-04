import { motion } from 'framer-motion';
import { FaGavel, FaFileAlt, FaRegCopyright, FaHandshake } from 'react-icons/fa';

const Legal = () => {
  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <FaGavel className="text-4xl text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Legal Notices</h1>
          <p className="text-gray-400">Important legal information about StreamFlix services</p>
        </motion.div>

        <div className="space-y-8">
          <section className="bg-gray-850 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Copyright Notice</h2>
            <div className="flex items-start space-x-4">
              <FaRegCopyright className="text-2xl text-primary flex-shrink-0 mt-1" />
              <div className="text-gray-300">
                <p className="mb-4">
                  All content available through StreamFlix, including but not limited to text, graphics, logos, button icons, images, audio clips, digital downloads, and data compilations is the property of StreamFlix or its content suppliers and is protected by international copyright laws.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gray-850 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Trademark Information</h2>
            <div className="flex items-start space-x-4">
              <FaFileAlt className="text-2xl text-primary flex-shrink-0 mt-1" />
              <div className="text-gray-300">
                <p className="mb-4">
                  StreamFlix and the StreamFlix logo are registered trademarks. All other trademarks not owned by StreamFlix that appear are the property of their respective owners.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gray-850 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">License Agreements</h2>
            <div className="flex items-start space-x-4">
              <FaHandshake className="text-2xl text-primary flex-shrink-0 mt-1" />
              <div className="text-gray-300">
                <p className="mb-4">
                  Use of StreamFlix services is subject to compliance with our license agreements. Unauthorized use, reproduction, or distribution of our content may result in civil and criminal penalties.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>End User License Agreement (EULA)</li>
                  <li>Content License Terms</li>
                  <li>Software License Agreement</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-gray-850 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Legal Compliance</h2>
            <div className="text-gray-300">
              <p className="mb-4">
                StreamFlix complies with all applicable laws and regulations in the jurisdictions where we operate, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Digital Millennium Copyright Act (DMCA)</li>
                <li>General Data Protection Regulation (GDPR)</li>
                <li>California Consumer Privacy Act (CCPA)</li>
                <li>Electronic Communications Privacy Act</li>
              </ul>
            </div>
          </section>
        </div>

        <div className="mt-12 p-6 bg-gray-850 rounded-xl text-center">
          <h3 className="text-xl font-bold mb-4">Need Legal Assistance?</h3>
          <p className="text-gray-400 mb-6">
            For legal inquiries or to report copyright infringement, please contact our legal team.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Contact Legal Team
            </button>
            <button className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              Report Infringement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;