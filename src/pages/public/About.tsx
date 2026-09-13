import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Heart, Target, ArrowRight, Zap } from 'lucide-react';
import { getClubStats, getSiteSettings } from '../../services/site/siteService';
import { getPlayers } from '../../services/players/playerService';
import type { ClubStats, SiteSettings } from '../../types';

export const About: React.FC = () => {
  const [clubStats, setClubStats] = useState<ClubStats | null>(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getClubStats().then(cs => setClubStats(cs)).catch(() => {});
    getPlayers().then(p => setPlayerCount(p.filter(pl => pl.status === 'Active').length)).catch(() => {});
    getSiteSettings().then(s => setSiteSettings(s)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-cricket-dark">
      {/* Hero */}
      <div className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cricket-gold/5 to-transparent" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-cricket-gold/10 border border-cricket-gold/30 rounded-full px-4 py-1.5 mb-6">
            <Heart size={16} className="text-cricket-gold" />
            <span className="text-cricket-gold text-sm font-medium">Our Story</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight mb-4">
            {siteSettings?.aboutTitle || 'About Cricket Pagla'}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            More than just a club — a brotherhood bound by the love of the game
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Our <span className="text-cricket-gold">Journey</span></h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                {siteSettings?.aboutText ? (
                  siteSettings.aboutText.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                ) : (
                  <>
                    <p>
                      Cricket Pagla was born from a shared dream — a group of passionate cricketers who believed
                      that the love for the sport could unite people beyond boundaries. What started as informal
                      games in local grounds has evolved into one of the most competitive and respected cricket
                      organizations in the region.
                    </p>
                    <p>
                      Our vision is simple yet powerful: foster local talent, play highly competitive cricket,
                      and build a community that thrives on discipline, hard work, and the joy of every moment
                      on the pitch. We believe in nurturing raw talent and providing a platform where players
                      can showcase their skills and grow together.
                    </p>
                    <p>
                      From participating in local tournaments to competing in top-tier series and championships,
                      Cricket Pagla has grown from strength to strength. Every match we play, every practice
                      session we hold, and every moment we share off the field strengthens the bond that makes
                      us more than just a team — we are family.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-[#0a0a0a] border-y border-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12 uppercase">Our <span className="text-cricket-gold">Values</span></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <ValueCard
              icon={<Trophy className="h-8 w-8 text-cricket-gold" />}
              title="Excellence"
              description="We strive for excellence in every aspect of the game, from training to tournament performance."
            />
            <ValueCard
              icon={<Users className="h-8 w-8 text-cricket-gold" />}
              title="Brotherhood"
              description="Beyond teammates, we are a family. Trust, respect, and camaraderie define us on and off the field."
            />
            <ValueCard
              icon={<Target className="h-8 w-8 text-cricket-gold" />}
              title="Discipline"
              description="Consistent hard work, dedication, and a disciplined approach to fitness and skill development."
            />
            <ValueCard
              icon={<Zap className="h-8 w-8 text-cricket-gold" />}
              title="Passion"
              description="The love for cricket drives everything we do. We play with heart, celebrate every moment."
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
            <div>
              <div className="text-4xl font-bold text-cricket-gold mb-1">{clubStats?.yearsActive || 2}+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Years Active</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cricket-gold mb-1">{playerCount || clubStats?.totalPlayers || 60}+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Players</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cricket-gold mb-1">{clubStats?.totalMatches || 0}+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Matches Played</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cricket-gold mb-1">100%</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Passion</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-cricket-gold">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-cricket-dark mb-4">Want to be part of the journey?</h2>
          <p className="text-cricket-dark/70 mb-6 max-w-xl mx-auto">
            Join Cricket Pagla and become a part of this growing family of passionate cricketers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/players"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium rounded-lg text-white bg-cricket-dark hover:bg-black transition-colors"
            >
              View Players <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium rounded-lg text-cricket-dark bg-white hover:bg-gray-100 transition-colors"
            >
              Join Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const ValueCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center hover:border-cricket-gold/30 transition-all card-hover">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-cricket-gold/10 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
);
