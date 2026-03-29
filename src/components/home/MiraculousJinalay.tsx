'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const bentoItems = [
  {
    title: "Shri Jirawala Parshwanath Dada",
    description: "The primary deity established in VS 1903. The idol exudes boundless peace, drawing devotees from distant lands seeking solace and miracles.",
  },
  {
    title: "The Swinging Bell",
    description: "A mysterious bell that rotates on its own during evening Aarti and upon the arrival of ascetics.",
  },
  {
    title: "The Peacock's Aarti",
    description: "A peacock gracefully sits atop the temple spire exactly during the evening prayer, bowing to the divine.",
  },
  {
    title: "Divine Music",
    description: "In the quiet of the night, echoes of celestial music and dance can often be heard within these ancient walls.",
  }
];

export default function MiraculousJinalay() {
  return (
    <section className="relative py-24 md:py-32 bg-[#0F1115] text-[#E5E7EB] overflow-hidden min-h-screen flex items-center">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/5 via-[#0F1115] to-[#0F1115] pointer-events-none" />
      
      <div className="container-wide relative z-10 mx-auto px-6 md:px-12 lg:px-20 max-w-7xl">
        <div className="mb-16 text-center md:text-left">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#D4AF37] uppercase tracking-widest text-sm font-semibold mb-4 border-l-2 border-[#D4AF37] pl-4 md:pl-0 md:border-l-0 inline-block md:block"
          >
            The Epicenter
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="font-display text-4xl md:text-6xl lg:text-7xl text-white font-bold tracking-tight"
          >
            The Miraculous Jinalay
          </motion.h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[auto]">
          
          {/* Primary Tile (Spans 2 columns on tablet/desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 glass-dark rounded-[2.5rem] border-2 border-[#D4AF37]/30 overflow-hidden relative group p-8 md:p-14 min-h-[400px] flex flex-col justify-end"
          >
             <div 
               className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-1000 scale-105 group-hover:scale-100"
               style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549488344-c6a6552a9d80?q=80&w=2000')" }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/50 to-transparent" />
             
             <div className="relative z-10 mt-20">
                <span className="text-[#D4AF37] font-mono text-sm tracking-wider mb-3 block border border-[#D4AF37]/40 w-max px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md">Est. VS 1903</span>
                <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-5 drop-shadow-2xl">{bentoItems[0].title}</h3>
                <p className="text-white/80 text-lg md:text-xl max-w-xl leading-relaxed font-medium">{bentoItems[0].description}</p>
             </div>
          </motion.div>

          {/* Secondary Tile 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-dark rounded-[2rem] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 p-8 flex flex-col justify-center transition-all duration-300 shadow-xl min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 mb-5 flex items-center justify-center bg-[#D4AF37]/5">🔔</div>
            <h4 className="text-xl md:text-2xl font-display font-semibold text-[#D4AF37] mb-3">{bentoItems[1].title}</h4>
            <p className="text-white/70 text-sm md:text-base leading-relaxed">{bentoItems[1].description}</p>
          </motion.div>

          {/* Secondary Tile 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="glass-dark rounded-[2rem] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 p-8 flex flex-col justify-center transition-all duration-300 shadow-xl min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 mb-5 flex items-center justify-center bg-[#D4AF37]/5">🦚</div>
            <h4 className="text-xl md:text-2xl font-display font-semibold text-[#D4AF37] mb-3">{bentoItems[2].title}</h4>
            <p className="text-white/70 text-sm md:text-base leading-relaxed">{bentoItems[2].description}</p>
          </motion.div>

          {/* Secondary Tile 3 (Full width across bottom of grid) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-3 mt-2 glass-dark rounded-[2rem] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden relative group"
          >
              <div className="absolute right-0 top-0 w-64 h-full bg-[radial-gradient(circle,_rgba(212,175,55,0.1)_0%,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div>
                <h4 className="text-2xl md:text-3xl font-display font-semibold text-[#D4AF37] mb-3">{bentoItems[3].title}</h4>
                <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-3xl">{bentoItems[3].description}</p>
              </div>
              <div className="hidden md:flex w-16 h-16 rounded-full border border-[#D4AF37]/30 items-center justify-center bg-[#D4AF37]/5 shrink-0 group-hover:scale-110 transition-transform duration-500">
                ✨
              </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
