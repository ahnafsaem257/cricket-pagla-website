export type UserRole = 'ADMIN' | 'PLAYER' | 'MANAGEMENT';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'DISABLED';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  profilePhoto?: string;
  createdAt: string; // ISO String or Firestore Timestamp
  updatedAt: string;
}

export type PlayingRole = 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket Keeper' | 'Unspecified';
export type BattingStyle = 'Right Hand' | 'Left Hand';
export type BowlingStyle = 'Right Arm Fast' | 'Left Arm Fast' | 'Right Arm Medium' | 'Left Arm Medium' | 'Right Arm Spin' | 'Left Arm Spin' | 'Off Spin' | 'Leg Spin';
export type PlayerStatus = 'Active' | 'Inactive' | 'Injured' | 'Retired';

export interface Player {
  playerId: string;
  userId?: string;
  fullName: string;
  nickname?: string;
  profilePhoto?: string;
  jerseyNumber?: number | null;
  playingRole: PlayingRole;
  battingStyle?: BattingStyle | null;
  bowlingStyle?: BowlingStyle | null;
  team?: string;
  teamId?: string;
  joiningDate?: string;
  bio?: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  bloodGroup?: string;
  status: PlayerStatus;
  createdAt: string;
  updatedAt: string;
}

export type MatchStatus = 'Upcoming' | 'Live' | 'Completed' | 'Postponed' | 'Cancelled';
export type MatchType = 'T20' | 'ODI' | 'Test' | 'Friendly' | 'Practice' | 'Tournament' | 'Series';

export interface Match {
  matchId: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  teamA: string;
  teamB: string;
  competition?: string;
  matchType: MatchType;
  tossWinner?: string;
  tossDecision?: 'Bat' | 'Bowl';
  status: MatchStatus;
  winner?: string;
  resultSummary?: string;
  teamAScore?: number;
  teamAOvers?: number;
  teamAWickets?: number;
  teamBScore?: number;
  teamBOvers?: number;
  teamBWickets?: number;
  manOfTheMatch?: string;
  description?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MatchPerformance {
  performanceId: string;
  matchId: string;
  playerId: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  overs: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  catches: number;
  runOuts: number;
  stumpings: number;
  dismissals: number;
  createdAt: string;
}

export interface Notice {
  noticeId: string;
  title: string;
  description: string;
  category: 'General' | 'Match' | 'Training' | 'Tournament' | 'Meeting' | 'Important';
  priority: 'Normal' | 'Important' | 'Urgent';
  date: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImage {
  imageId: string;
  url: string;
  title?: string;
  caption?: string;
  category: 'Matches' | 'Training' | 'Tournament' | 'Series' | 'Team' | 'Celebration' | 'Awards' | 'Events';
  published: boolean;
  createdAt: string;
}

export interface Announcement {
  announcementId: string;
  title: string;
  content: string;
  thumbnail?: string;
  type: 'New Player' | 'News';
  status: 'published' | 'draft';
  createdAt: string;
}

export type TournamentStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
export type TournamentFormat = 'T20' | 'ODI' | 'Test' | 'Friendly' | 'Series';

export interface Tournament {
  tournamentId: string;
  name: string;
  description?: string;
  logo?: string;
  startDate: string;
  endDate?: string;
  venue?: string;
  organizer?: string;
  format: TournamentFormat;
  teams?: string[];
  status: TournamentStatus;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
