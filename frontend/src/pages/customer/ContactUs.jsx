import { HelpCircle, MessageSquare, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import axios from 'axios';

export function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);
    setStatusMessage('');

    try {
      const response = await axios.post('https://formspree.io/f/xwvyagrr', {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });

      if (response.status === 200) {
        setSubmitStatus('success');
        setStatusMessage('🎉 Message sent successfully! We will get back to you soon.');
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      setSubmitStatus('error');
      setStatusMessage('❌ Failed to send message. Please try again later.');
      console.error('FormSpree error:', error);
    } finally {
      setLoading(false);
      // Auto-clear status message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
        setStatusMessage('');
      }, 5000);
    }
  };

  return (
    <section className="py-24 px-4 bg-[#8338ec] relative overflow-hidden">
      {/* Fun background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#ffd166] rounded-full mix-blend-multiply filter blur-2xl opacity-80"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#06d6a0] rounded-full mix-blend-multiply filter blur-2xl opacity-80"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20, rotate: -5 }}
            whileInView={{ opacity: 1, y: 0, rotate: -2 }}
            viewport={{ once: true }}
            className="inline-block mb-4 bg-[#ffd166] border-2 border-black px-4 py-1 rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
          >
            <span className="text-black font-bold tracking-wider text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4" style={{ strokeWidth: 3 }} /> SUPPORT CENTER
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl text-white drop-shadow-[3px_3px_0_rgba(0,0,0,1)]" style={{
              fontFamily: "'Chewy', cursive",
            }}
          >
            Get In Touch!
            Or Request for custom costume
          </motion.h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 border-4 border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] relative"
        >
          <div className="absolute -top-6 -right-6 bg-[#ef476f] text-white p-4 rounded-full border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] rotate-12">
            <MessageSquare className="w-8 h-8" style={{ strokeWidth: 3, fill: 'currentColor' }} />
          </div>

          <h3 className="text-3xl text-black mb-2 border-b-4 border-[#06d6a0] inline-block pb-2 uppercase tracking-wide" style={{
            fontFamily: "'Chewy', cursive",
          }}>
            Contact Support
          </h3>
          <p className="text-lg font-bold text-neutral-600 mb-8 max-w-2xl mt-4">
            Drop your query here and our team of highly trained party animals will get back to you as soon as possible!
          </p>

          {submitStatus && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-xl border-2 font-bold ${
                submitStatus === 'success' 
                  ? 'bg-green-100 border-green-500 text-green-700' 
                  : 'bg-red-100 border-red-500 text-red-700'
              }`}
            >
              {statusMessage}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-bold text-sm tracking-wider text-black block uppercase">Name</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#fdf8e6] border-2 border-black rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-[#ef476f] focus:ring-4 focus:ring-[#ef476f]/30 transition-all shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.05)]"
                />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm tracking-wider text-black block uppercase">Email</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#fdf8e6] border-2 border-black rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-[#ef476f] focus:ring-4 focus:ring-[#ef476f]/30 transition-all shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.05)]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-sm tracking-wider text-black block uppercase">Subject</label>
              <input 
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-[#fdf8e6] border-2 border-black rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-[#ef476f] focus:ring-4 focus:ring-[#ef476f]/30 transition-all shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.05)]"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-sm tracking-wider text-black block uppercase">Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full bg-[#fdf8e6] border-2 border-black rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-[#ef476f] focus:ring-4 focus:ring-[#ef476f]/30 transition-all shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.05)] resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="bg-[#ffd166] text-black px-8 py-4 rounded-xl border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 font-bold transition-all text-xl flex items-center gap-3 w-full justify-center md:w-auto uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed" style={{
                fontFamily: "'Chewy', cursive",
              }}
            >
              <Send className="w-5 h-5" style={{ strokeWidth: 3 }} />
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
