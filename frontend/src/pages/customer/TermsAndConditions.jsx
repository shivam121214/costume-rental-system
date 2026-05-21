import { FileText, AlertCircle, Shield, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export function TermsAndConditions() {
  const terms = [
    {
      number: "1",
      title: "Order Cancellation",
      description: "Order once booked will not be cancelled.",
      icon: AlertCircle,
      color: "#ef476f",
      bgColor: "#ffc2d1"
    },
    {
      number: "2",
      title: "Advance Payment Required",
      description: "Hire charges are required to be paid in advance.",
      icon: Zap,
      color: "#ffd166",
      bgColor: "#fffacd"
    },
    {
      number: "3",
      title: "Full Hire Charges",
      description: "Full hire charges shall be charged irrespective of the fact whether or not delivery of the article are taken.",
      icon: Shield,
      color: "#06d6a0",
      bgColor: "#d4f8f0"
    },
    {
      number: "4",
      title: "Damage & Loss",
      description: "Full cost will be charged for any articles or part thereof torn, damaged or lost.",
      icon: AlertCircle,
      color: "#ef476f",
      bgColor: "#ffc2d1"
    },
    {
      number: "5",
      title: "Loan & Transfer Prohibited",
      description: "Articles taken on hire shall not be loaned, mortgaged, sold, pledged or deposited with any other person or party.",
      icon: Shield,
      color: "#06d6a0",
      bgColor: "#d4f8f0"
    },
    {
      number: "6",
      title: "Return & Extension Policy",
      description: "Articles taken on hire shall return on due dates. Failing to do so, additional charge shall have to be paid for the period of extension on the basis of full period and not on any part thereof.",
      icon: Zap,
      color: "#ffd166",
      bgColor: "#fffacd"
    }
  ];

  return (
    <section className="min-h-screen py-24 px-4 bg-[#8338ec] relative overflow-hidden">
      {/* Fun background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#ffd166] rounded-full mix-blend-multiply filter blur-2xl opacity-80"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#06d6a0] rounded-full mix-blend-multiply filter blur-2xl opacity-80"></div>
      <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-[#ef476f] rounded-full mix-blend-multiply filter blur-2xl opacity-60"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20, rotate: -5 }}
            whileInView={{ opacity: 1, y: 0, rotate: -2 }}
            viewport={{ once: true }}
            className="inline-block mb-4 bg-[#ffd166] border-2 border-black px-4 py-1 rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
          >
            <span className="text-black font-bold tracking-wider text-sm flex items-center gap-2 justify-center">
              <FileText className="w-4 h-4" style={{ strokeWidth: 3 }} /> TERMS & CONDITIONS
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl text-white drop-shadow-[3px_3px_0_rgba(0,0,0,1)] mb-4" 
            style={{ fontFamily: "'Chewy', cursive" }}
          >
            Rental Terms & Conditions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white text-lg md:text-xl font-bold drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
          >
            Please read our rental policies carefully before booking
          </motion.p>
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {terms.map((term, index) => {
            const Icon = term.icon;
            return (
              <motion.div
                key={term.number}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-[8px_8px_0_0_rgba(0,0,0,1)] transition-all"
              >
                {/* Number Badge */}
                <div className="flex items-start gap-4 mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center border-3 border-black font-black text-xl flex-none"
                    style={{ backgroundColor: term.bgColor, color: term.color }}
                  >
                    {term.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-black mb-2">
                      {term.title}
                    </h3>
                  </div>
                </div>

                {/* Icon and Description */}
                <div className="flex gap-3 ml-2">
                  <div className="flex-none pt-1">
                    <Icon 
                      size={24} 
                      style={{ color: term.color, strokeWidth: 2.5 }}
                    />
                  </div>
                  <p className="text-black font-bold text-sm leading-relaxed">
                    {term.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] mb-8"
        >
          <div className="flex gap-4 items-start">
            <AlertCircle 
              size={32} 
              className="text-red-600 flex-none"
              style={{ strokeWidth: 2.5 }}
            />
            <div>
              <h3 className="text-2xl font-black text-black mb-3" style={{ fontFamily: "'Chewy', cursive" }}>
                ⚠️ Important Notice
              </h3>
              <p className="text-black font-bold text-base leading-relaxed">
                By booking with us, you acknowledge that you have read, understood, and agree to all the terms and conditions mentioned above. Any violation of these terms may result in additional charges or legal action. We appreciate your cooperation and trust in our rental service.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Acceptance Checkbox Area */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#ffd166] border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] text-center"
        >
          <p className="text-black font-black text-lg" style={{ fontFamily: "'Chewy', cursive" }}>
            ✅ I Agree to the Terms & Conditions
          </p>
          <p className="text-black font-bold mt-2">
            By proceeding with your booking, you automatically accept all terms and conditions
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default TermsAndConditions;
