import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy, Users, ArrowRight, Activity, CalendarDays,
  ChevronLeft, ChevronRight, Shield, Flag, Star,
  Camera, Target, Award, MapPin
} from 'lucide-react';
import { getPlayers } from '../../services/players/playerService';
import { getMatches } from '../../services/matches/matchService';
import { getPublishedTournaments } from '../../services/tournaments/tournamentService';
import { getActiveTeams } from '../../services/teams/teamService';
import { getPublishedNotices } from '../../services/notices/noticeService';
import { getPublishedGalleryImages } from '../../services/gallery/galleryService';
import { getSiteSettings, getClubStats } from '../../services/site/siteService';
import { getLatestPlayerOfMonth } from '../../services/playerOfMonth/playerOfMonthService';
import type { Player, Match, Tournament, Team, Notice, GalleryImage, SiteSettings, ClubStats, PlayerOfMonth } from '../../types';

const AnimatedCounter = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !hasStarted) setHasStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return <div ref={ref} className="text-4xl md:text-5xl font-extrabold text-white mb-1">{count}</div>;
};

const ROLE_COLORS: Record<string, string> = {
  'All-Rounder': 'bg-emerald-900/60 text-emerald-300',
  'Batsman': 'bg-blue-900/60 text-blue-300',
  'Bowler': 'bg-red-900/60 text-red-300',
  'Wicket Keeper': 'bg-purple-900/60 text-purple-300',
  'Unspecified': 'bg-gray-800/60 text-gray-400',
};

const STATUS_STYLES: Record<string, string> = {
  Upcoming: 'bg-blue-900/60 text-blue-300',
  Live: 'bg-red-900/60 text-red-300 animate-pulse',
  Completed: 'bg-emerald-900/60 text-emerald-300',
  Ongoing: 'bg-emerald-900/60 text-emerald-300 animate-pulse',
};

export const Home: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [clubStats, setClubStats] = useState<ClubStats | null>(null);
  const [playerOfMonth, setPlayerOfMonth] = useState<PlayerOfMonth | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      getPlayers().catch(() => []),
      getMatches().catch(() => []),
      getPublishedTournaments().catch(() => []),
      getActiveTeams().catch(() => []),
      getPublishedNotices().catch(() => []),
      getPublishedGalleryImages().catch(() => []),
      getSiteSettings().catch(() => null),
      getClubStats().catch(() => null),
      getLatestPlayerOfMonth().catch(() => null),
    ]).then(([p, m, t, tm, n, g, ss, cs, potm]) => {
      setPlayers(p.filter(pl => pl.status === 'Active' || pl.status === 'Injured'));
      setMatches(m);
      setTournaments(t);
      setTeams(tm);
      setNotices(n);
      setGalleryImages(g);
      setSiteSettings(ss);
      setClubStats(cs);
      setPlayerOfMonth(potm);
    });
  }, []);

  const activePlayers = clubStats?.totalPlayers || players.length;
  const completedMatches = clubStats?.totalMatches || matches.filter(m => m.status === 'Completed').length;
  const activeTournaments = clubStats?.totalTournaments || tournaments.filter(t => t.status === 'Ongoing' || t.status === 'Upcoming').length;
  const yearsActive = clubStats?.yearsActive || 2;

  const latestTournament = tournaments.find(t => t.status === 'Ongoing' || t.status === 'Upcoming') || tournaments[0] || null;
  const upcomingMatch = matches.find(m => m.status === 'Upcoming');
  const latestResult = [...matches].filter(m => m.status === 'Completed').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  const latestNotices = notices.slice(0, 4);
  const featuredPlayers = players.slice(0, 6);
  const latestGallery = galleryImages.slice(0, 8);

  const topRunScorer = [...players].filter(p => p.runs && p.runs > 0).sort((a, b) => (b.runs || 0) - (a.runs || 0))[0];
  const topWicketTaker = [...players].filter(p => p.wickets && p.wickets > 0).sort((a, b) => (b.wickets || 0) - (a.wickets || 0))[0];
  const mostCatches = [...players].filter(p => p.catches && p.catches > 0).sort((a, b) => (b.catches || 0) - (a.catches || 0))[0];
  const bestPlayer = [...players].filter(p => p.totalPoints && p.totalPoints > 0).sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))[0];

  const hasTopPerformers = topRunScorer || topWicketTaker || mostCatches || bestPlayer;

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  const heroImage = siteSettings?.heroImage || 'https://res.cloudinary.com/eradnx1z/image/upload/f_auto,q_auto/705698877_122106305739303794_7904985026749609594_n';

  return (
    <div className="bg-cricket-dark">
      {/* 1. Hero Section */}
      <section className="relative h-[500px] sm:h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 hero-overlay z-10" />
          <img
            src={heroImage}
            alt="Cricket Stadium"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 fade-in-up w-full max-w-4xl mx-auto">
          <img
            src="/logo.jpg"
            alt="Cricket Pagla"
            className="mx-auto h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 object-contain rounded-full border-4 border-cricket-gold shadow-2xl mb-6 sm:mb-8"
          />
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight uppercase mb-4 sm:mb-6">
            {siteSettings?.heroTitle || 'Cricket'} <span className="text-cricket-gold">{siteSettings?.heroSubtitle ? '' : 'Pagla'}</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light tracking-wide mb-8 sm:mb-10">
            {siteSettings?.heroSubtitle || 'Passion • Performance • Brotherhood'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              to={siteSettings?.heroCtaLink || '/players'}
              className="px-8 py-3.5 text-sm sm:text-base font-bold rounded-lg text-cricket-dark bg-cricket-gold hover:bg-cricket-gold-light transition-all duration-200 hover:shadow-lg hover:shadow-cricket-gold/20 flex items-center justify-center gap-2"
            >
              {siteSettings?.heroCtaText || 'Explore Players'} <ArrowRight size={18} />
            </Link>
            <Link
              to={siteSettings?.heroSecondaryCtaLink || '/matches'}
              className="px-8 py-3.5 text-sm sm:text-base font-bold rounded-lg text-white border-2 border-white/30 hover:border-white hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {siteSettings?.heroSecondaryCtaText || 'View Matches'}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Club Statistics */}
      <section className="py-16 md:py-20 bg-cricket-darker border-y border-cricket-border">
        <div className="w-full max-w-[1440px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 text-center">
            <div>
              <Users className="mx-auto h-10 w-10 text-cricket-gold mb-3" />
              <AnimatedCounter end={activePlayers} />
              <div className="text-sm text-gray-400 uppercase tracking-wider font-medium">Total Players</div>
            </div>
            <div>
              <Shield className="mx-auto h-10 w-10 text-cricket-gold mb-3" />
              <AnimatedCounter end={teams.length} />
              <div className="text-sm text-gray-400 uppercase tracking-wider font-medium">Teams</div>
            </div>
            <div>
              <Activity className="mx-auto h-10 w-10 text-cricket-gold mb-3" />
              <AnimatedCounter end={completedMatches} />
              <div className="text-sm text-gray-400 uppercase tracking-wider font-medium">Matches Played</div>
            </div>
            <div>
              <Trophy className="mx-auto h-10 w-10 text-cricket-gold mb-3" />
              <AnimatedCounter end={activeTournaments} duration={1500} />
              <div className="text-sm text-gray-400 uppercase tracking-wider font-medium">Tournaments</div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <CalendarDays className="mx-auto h-10 w-10 text-cricket-gold mb-3" />
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-1">{yearsActive}+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider font-medium">Years Active</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Next Match / 4. Latest Result */}
      {(upcomingMatch || latestResult) && (
        <section className="py-16 md:py-20 bg-[#0a0a0a] border-y border-cricket-border">
          <div className="w-full max-w-[1440px] mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {upcomingMatch && (
                <div>
                  <div className="text-center mb-6">
                    <span className="inline-flex items-center gap-2 bg-blue-900/30 text-blue-300 border border-blue-700/50 rounded-full px-4 py-1.5 text-sm font-medium mb-3">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      Upcoming Match
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase">
                      Next <span className="text-cricket-gold">Fixture</span>
                    </h2>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-white font-bold text-lg">{upcomingMatch.title}</h3>
                      {upcomingMatch.competition && <p className="text-cricket-gold text-sm mt-1">{upcomingMatch.competition}</p>}
                    </div>
                    <div className="flex items-center justify-center gap-6 my-6">
                      <div className="text-center flex-1">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center mb-2">
                          <Shield size={28} className="text-gray-500" />
                        </div>
                        <span className="text-white font-bold text-sm">{upcomingMatch.teamA}</span>
                      </div>
                      <span className="text-gray-500 font-extrabold text-2xl">VS</span>
                      <div className="text-center flex-1">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center mb-2">
                          <Shield size={28} className="text-gray-500" />
                        </div>
                        <span className="text-white font-bold text-sm">{upcomingMatch.teamB}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {new Date(upcomingMatch.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      {upcomingMatch.time && <span className="flex items-center gap-1.5">{upcomingMatch.time}</span>}
                      {upcomingMatch.venue && <span className="flex items-center gap-1.5"><MapPin size={14} /> {upcomingMatch.venue}</span>}
                    </div>
                  </div>
                </div>
              )}

              {latestResult && (
                <div>
                  <div className="text-center mb-6">
                    <span className="inline-flex items-center gap-2 bg-emerald-900/30 text-emerald-300 border border-emerald-700/50 rounded-full px-4 py-1.5 text-sm font-medium mb-3">
                      <Trophy size={14} />
                      Latest Result
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase">
                      Match <span className="text-cricket-gold">Result</span>
                    </h2>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-white font-bold text-lg">{latestResult.title}</h3>
                      {latestResult.competition && <p className="text-cricket-gold text-sm mt-1">{latestResult.competition}</p>}
                    </div>
                    <div className="flex items-center justify-center gap-4 my-6">
                      <div className="text-center flex-1">
                        <span className="text-white font-bold text-sm block mb-2">{latestResult.teamA}</span>
                        {latestResult.teamAScore != null && (
                          <span className="text-cricket-gold font-mono font-bold text-lg">{latestResult.teamAScore}/{latestResult.teamAWickets} <span className="text-gray-500 text-sm">({latestResult.teamAOvers} ov)</span></span>
                        )}
                      </div>
                      <span className="text-gray-500 font-extrabold text-xl">VS</span>
                      <div className="text-center flex-1">
                        <span className="text-white font-bold text-sm block mb-2">{latestResult.teamB}</span>
                        {latestResult.teamBScore != null && (
                          <span className="text-cricket-gold font-mono font-bold text-lg">{latestResult.teamBScore}/{latestResult.teamBWickets} <span className="text-gray-500 text-sm">({latestResult.teamBOvers} ov)</span></span>
                        )}
                      </div>
                    </div>
                    {latestResult.resultSummary && (
                      <div className="text-center p-3 bg-cricket-gold/10 rounded-lg border border-cricket-gold/20">
                        <p className="text-cricket-gold font-medium text-sm">{latestResult.resultSummary}</p>
                      </div>
                    )}
                    {latestResult.manOfTheMatch && (
                      <p className="text-gray-400 text-xs mt-3 text-center">
                        Player of the Match: <span className="text-white font-medium">{latestResult.manOfTheMatch}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 5. Player of the Month */}
      {playerOfMonth && (
        <section className="py-16 md:py-20">
          <div className="w-full max-w-[1440px] mx-auto px-4">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-cricket-gold/10 border border-cricket-gold/30 rounded-full px-4 py-1.5 text-sm font-medium text-cricket-gold mb-4">
                <Award size={14} />
                Player of the Month
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase">
                {playerOfMonth.month} <span className="text-cricket-gold">{playerOfMonth.year}</span>
              </h2>
            </div>
            <div className="max-w-2xl mx-auto bg-gray-900 border border-cricket-gold/20 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative flex-shrink-0">
                  {playerOfMonth.playerPhoto ? (
                    <img src={playerOfMonth.playerPhoto} alt={playerOfMonth.playerName}
                      className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-cricket-gold shadow-xl" />
                  ) : (
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-4 border-cricket-gold shadow-xl flex items-center justify-center">
                      <span className="text-5xl font-bold text-gray-500">{playerOfMonth.playerName.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute -top-2 -right-2 bg-cricket-gold text-cricket-dark w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                    <Star size={20} />
                  </div>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{playerOfMonth.playerName}</h3>
                  <p className="text-gray-400 text-sm mb-3">{playerOfMonth.team} &bull; {playerOfMonth.role}</p>
                  <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                    {playerOfMonth.runs ? <span className="text-sm"><span className="text-white font-bold">{playerOfMonth.runs}</span> <span className="text-gray-500">runs</span></span> : null}
                    {playerOfMonth.wickets ? <span className="text-sm"><span className="text-white font-bold">{playerOfMonth.wickets}</span> <span className="text-gray-500">wickets</span></span> : null}
                    {playerOfMonth.catches ? <span className="text-sm"><span className="text-white font-bold">{playerOfMonth.catches}</span> <span className="text-gray-500">catches</span></span> : null}
                    {playerOfMonth.runOuts ? <span className="text-sm"><span className="text-white font-bold">{playerOfMonth.runOuts}</span> <span className="text-gray-500">run outs</span></span> : null}
                  </div>
                  <div className="mt-3 text-cricket-gold font-extrabold text-lg">{playerOfMonth.totalPoints} Points</div>
                </div>
              </div>
              <div className="text-center mt-6">
                <Link to="/player-of-the-month" className="inline-flex items-center gap-2 text-cricket-gold hover:text-cricket-gold-light font-bold transition-colors text-sm">
                  View All Winners <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. Featured Players */}
      {featuredPlayers.length > 0 && (
        <section className="py-16 md:py-20 bg-[#0a0a0a] border-y border-cricket-border">
          <div className="w-full max-w-[1440px] mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase">
                  Our <span className="text-cricket-gold">Squad</span>
                </h2>
                <p className="text-gray-400 mt-2">The heart and soul of Cricket Pagla</p>
              </div>
              <div className="hidden sm:flex gap-2">
                <button onClick={() => scrollCarousel('left')} className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors border border-gray-700">
                  <ChevronLeft size={20} className="text-white" />
                </button>
                <button onClick={() => scrollCarousel('right')} className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors border border-gray-700">
                  <ChevronRight size={20} className="text-white" />
                </button>
              </div>
            </div>

            <div ref={carouselRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
              {featuredPlayers.map((player) => (
                <Link to={`/players/${player.playerId}`} key={player.playerId} className="flex-shrink-0 w-[180px] sm:w-[200px] snap-start group">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-800 border border-gray-700 group-hover:border-cricket-gold/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-cricket-gold/10">
                    {player.profilePhoto ? (
                      <img src={player.profilePhoto} alt={player.fullName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                        <span className="text-5xl font-bold text-gray-700">{player.fullName.charAt(0)}</span>
                      </div>
                    )}
                    {player.jerseyNumber != null && (
                      <div className="absolute top-2 right-2 bg-cricket-gold text-cricket-dark font-black text-xs w-7 h-7 rounded-full flex items-center justify-center shadow-lg">
                        {player.jerseyNumber === 0 ? '00' : player.jerseyNumber}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-bold text-sm truncate">{player.fullName}</h3>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${ROLE_COLORS[player.playingRole] || 'bg-gray-800 text-gray-400'}`}>
                        {player.playingRole}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link to="/players" className="inline-flex items-center gap-2 px-6 py-3 bg-cricket-gold text-cricket-dark font-bold rounded-full hover:bg-cricket-gold-light transition-all hover:shadow-lg hover:shadow-cricket-gold/20">
                View Full Squad <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 7. Current Tournament */}
      {latestTournament && (
        <section className="py-16 md:py-20">
          <div className="w-full max-w-[1440px] mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-4 ${STATUS_STYLES[latestTournament.status] || 'bg-gray-800 text-gray-300'}`}>
                  <Flag size={14} />
                  {latestTournament.status} Tournament
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase">
                  Current <span className="text-cricket-gold">Tournament</span>
                </h2>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 text-center">
                {latestTournament.logo && (
                  <img src={latestTournament.logo} alt={latestTournament.name} className="h-16 w-16 mx-auto object-contain mb-4" />
                )}
                <h3 className="text-white font-extrabold text-2xl mb-2">{latestTournament.name}</h3>
                {latestTournament.description && <p className="text-gray-400 mb-4">{latestTournament.description}</p>}
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400 mb-6">
                  <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {latestTournament.startDate}</span>
                  {latestTournament.venue && <span className="flex items-center gap-1.5"><MapPin size={14} /> {latestTournament.venue}</span>}
                  {latestTournament.teams && <span className="flex items-center gap-1.5"><Users size={14} /> {latestTournament.teams.length} Teams</span>}
                </div>
                {latestTournament.status === 'Completed' && latestTournament.champion && (
                  <div className="p-3 bg-cricket-gold/10 rounded-lg border border-cricket-gold/20 mb-4">
                    <p className="text-cricket-gold font-medium flex items-center justify-center gap-2">
                      <Trophy size={16} /> Champion: {latestTournament.champion}
                    </p>
                    {latestTournament.runnerUp && (
                      <p className="text-gray-400 text-sm mt-1">Runner-up: {latestTournament.runnerUp}</p>
                    )}
                  </div>
                )}
                <Link to="/tournaments" className="inline-flex items-center gap-2 text-cricket-gold hover:text-cricket-gold-light font-bold transition-colors">
                  View Tournament Details <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. Top Performers */}
      {hasTopPerformers && (
        <section className="py-16 md:py-20 bg-[#0a0a0a] border-y border-cricket-border">
          <div className="w-full max-w-[1440px] mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase">
                Top <span className="text-cricket-gold">Performers</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {topRunScorer && (
                <PerformerCard icon={<Trophy size={24} />} label="Top Run Scorer" player={topRunScorer} stat={`${topRunScorer.runs} runs`} />
              )}
              {topWicketTaker && (
                <PerformerCard icon={<Target size={24} />} label="Top Wicket Taker" player={topWicketTaker} stat={`${topWicketTaker.wickets} wickets`} />
              )}
              {mostCatches && (
                <PerformerCard icon={<Activity size={24} />} label="Most Catches" player={mostCatches} stat={`${mostCatches.catches} catches`} />
              )}
              {bestPlayer && (
                <PerformerCard icon={<Award size={24} />} label="Best Player" player={bestPlayer} stat={`${bestPlayer.totalPoints} points`} />
              )}
            </div>
          </div>
        </section>
      )}

      {/* 9. Gallery Preview */}
      {latestGallery.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="w-full max-w-[1440px] mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase">
                Photo <span className="text-cricket-gold">Gallery</span>
              </h2>
              <p className="text-gray-400 mt-2">Moments from our journey</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
              {latestGallery.map((img) => (
                <div key={img.imageId} className="group relative rounded-xl overflow-hidden bg-gray-800 aspect-square">
                  <img src={img.url} alt={img.title || 'Gallery'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/gallery" className="inline-flex items-center gap-2 text-cricket-gold hover:text-cricket-gold-light font-bold transition-colors">
                View Full Gallery <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 10. Latest Notices */}
      {latestNotices.length > 0 && (
        <section className="py-16 md:py-20 bg-[#0a0a0a] border-y border-cricket-border">
          <div className="w-full max-w-[1440px] mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase">
                Latest <span className="text-cricket-gold">Notices</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {latestNotices.map((notice) => (
                <div key={notice.noticeId} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cricket-gold/10 text-cricket-gold border border-cricket-gold/30">
                      {notice.category}
                    </span>
                    {notice.priority !== 'Normal' && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${notice.priority === 'Urgent' ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                        {notice.priority}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-bold mb-2 line-clamp-2">{notice.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{notice.description}</p>
                  <div className="mt-3 text-gray-500 text-xs flex items-center gap-1">
                    <CalendarDays size={10} />
                    {new Date(notice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/notices" className="inline-flex items-center gap-2 text-cricket-gold hover:text-cricket-gold-light font-bold transition-colors">
                View All Notices <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 11. Join CTA */}
      <section className="py-16 md:py-20 bg-cricket-gold">
        <div className="w-full max-w-[1440px] mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-cricket-dark mb-4 uppercase">
            Ready to Join the Family?
          </h2>
          <p className="text-cricket-dark/70 mb-8 max-w-xl mx-auto text-lg">
            Become a part of Cricket Pagla and experience the passion of cricket.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold rounded-lg text-white bg-cricket-dark hover:bg-black transition-colors">
              Join Cricket Pagla <ArrowRight size={18} />
            </Link>
            <Link to="/players" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold rounded-lg text-cricket-dark bg-white hover:bg-gray-100 transition-colors">
              View Players
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const PerformerCard: React.FC<{ icon: React.ReactNode; label: string; player: Player; stat: string }> = ({ icon, label, player, stat }) => (
  <Link to={`/players/${player.playerId}`} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center hover:border-cricket-gold/30 transition-all group card-hover">
    <div className="text-cricket-gold mb-3 flex justify-center">{icon}</div>
    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{label}</p>
    {player.profilePhoto ? (
      <img src={player.profilePhoto} alt={player.fullName} className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-gray-700 group-hover:border-cricket-gold/50 mb-3" />
    ) : (
      <div className="w-16 h-16 rounded-full mx-auto bg-gray-800 flex items-center justify-center border-2 border-gray-700 group-hover:border-cricket-gold/50 mb-3">
        <span className="text-xl font-bold text-gray-600">{player.fullName.charAt(0)}</span>
      </div>
    )}
    <h3 className="text-white font-bold text-sm group-hover:text-cricket-gold transition-colors">{player.fullName}</h3>
    <p className="text-cricket-gold font-bold text-sm mt-1">{stat}</p>
  </Link>
);
