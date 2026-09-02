import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, ArrowRight, Activity, CalendarDays } from 'lucide-react';

export const Home: React.FC = () => {
  // In a real application, you might want to fetch these from an aggregated stats document
  // to avoid querying huge collections just for counts.
  
  return (
    <div className="bg-cricket-dark">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img 
            src="https://res.cloudinary.com/eradnx1z/image/upload/f_auto,q_auto/705698877_122106305739303794_7904985026749609594_n"
            alt="Cricket Stadium" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8">
          <img src="/logo.jpg" alt="Cricket Pagla" className="mx-auto h-32 w-32 object-contain rounded-full border-4 border-cricket-gold shadow-2xl mb-6" />
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight uppercase mb-4">
            Cricket <span className="text-cricket-gold">Pagla</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto italic font-light">
            "Passion • Performance • Brotherhood"
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/login" className="px-8 py-3 text-base font-medium rounded-md text-white bg-cricket-green hover:bg-[#0c6632] transition-colors">
              Join Cricket Pagla
            </Link>
            <Link to="/players" className="px-8 py-3 text-base font-medium rounded-md text-white bg-transparent border-2 border-white hover:bg-white hover:text-cricket-dark transition-colors">
              View Players
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#0a0a0a] border-y border-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <Users className="mx-auto h-10 w-10 text-cricket-gold mb-3" />
              <div className="text-4xl font-bold text-white mb-1">45+</div>
              <div className="text-sm text-gray-300 uppercase tracking-wide">Total Players</div>
            </div>
            <div>
              <Activity className="mx-auto h-10 w-10 text-cricket-gold mb-3" />
              <div className="text-4xl font-bold text-white mb-1">120+</div>
              <div className="text-sm text-gray-300 uppercase tracking-wide">Matches Played</div>
            </div>
            <div>
              <Trophy className="mx-auto h-10 w-10 text-cricket-gold mb-3" />
              <div className="text-4xl font-bold text-white mb-1">15</div>
              <div className="text-sm text-gray-300 uppercase tracking-wide">Championships</div>
            </div>
            <div>
              <CalendarDays className="mx-auto h-10 w-10 text-cricket-gold mb-3" />
              <div className="text-4xl font-bold text-white mb-1">8</div>
              <div className="text-sm text-gray-300 uppercase tracking-wide">Years Active</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 uppercase">About Cricket Pagla</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Cricket Pagla is more than just a club; it's a brotherhood bound by the love of the game. 
              Founded with the vision to foster local talent and play highly competitive cricket, we have 
              grown into a premier organization participating in top-tier tournaments and series. 
              We believe in discipline, hard work, and celebrating every moment on the pitch.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-cricket-gold">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-cricket-dark mb-6">Ready to hit it out of the park?</h2>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3 text-base font-medium rounded-md text-white bg-cricket-dark hover:bg-black transition-colors">
            Contact Us <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
