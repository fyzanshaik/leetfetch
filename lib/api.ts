import {
  User,
  Code,
  Trophy,
  Calendar,
  Target,
  TrendingUp,
  Award,
  Clock,
  Medal,
} from "lucide-react";
import { LucideIcon } from "lucide-react"; 

export interface Endpoint {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon; 
  category: string;
  query: string; 
  requiresAuth: boolean; 
  variables: Record<string, string | number>; 
  graphql: string; 
}

export interface ErrorResponse {
  error: true;
  message: string;
  details: string;
}


export type SuccessfulApiResponse = Record<string, unknown>;

export type ApiResponse = SuccessfulApiResponse | ErrorResponse;

export const endpoints: Endpoint[] = [
  {
    id: "userProfile",
    name: "User Profile Information",
    description:
      "Fetches basic user profile data, including contest badges, social media links, personal details, and activity counts.",
    icon: User,
    category: "Profile",
    query: "userPublicProfile",
    requiresAuth: false,
    variables: { username: "String!" },
    graphql: `query userPublicProfile($username: String!) {
  matchedUser(username: $username) {
    contestBadge { name expired hoverText icon }
    username
    githubUrl
    twitterUrl
    linkedinUrl
    profile {
      ranking userAvatar realName aboutMe school websites countryName
      company jobTitle skillTags postViewCount postViewCountDiff
      reputation reputationDiff solutionCount solutionCountDiff
      categoryDiscussCount categoryDiscussCountDiff certificationLevel
    }
  }
}`,
  },
  {
    id: "languageStats",
    name: "Programming Language Statistics",
    description:
      "Retrieves problems solved broken down by programming language.",
    icon: Code,
    category: "Statistics",
    query: "languageStats",
    requiresAuth: false,
    variables: { username: "String!" },
    graphql: `query languageStats($username: String!) {
  matchedUser(username: $username) {
    languageProblemCount { languageName problemsSolved }
  }
}`,
  },
  {
    id: "skillStats",
    name: "Problem-Solving Skills Statistics",
    description:
      "Provides problems solved categorized by skill areas (advanced, intermediate, fundamental).",
    icon: Target,
    category: "Statistics",
    query: "skillStats",
    requiresAuth: false,
    variables: { username: "String!" },
    graphql: `query skillStats($username: String!) {
  matchedUser(username: $username) {
    tagProblemCounts {
      advanced { tagName tagSlug problemsSolved }
      intermediate { tagName tagSlug problemsSolved }
      fundamental { tagName tagSlug problemsSolved }
    }
  }
}`,
  },
  {
    id: "contestRanking",
    name: "Contest History and Rankings",
    description:
      "Gathers a user's contest participation history and ranking details.",
    icon: Trophy,
    category: "Contest",
    query: "userContestRankingInfo",
    requiresAuth: false,
    variables: { username: "String!" },
    graphql: `query userContestRankingInfo($username: String!) {
  userContestRanking(username: $username) {
    attendedContestsCount rating globalRanking totalParticipants
    topPercentage badge { name }
  }
  userContestRankingHistory(username: $username) {
    attended trendDirection problemsSolved totalProblems
    finishTimeInSeconds rating ranking
    contest { title startTime }
  }
}`,
  },
  {
    id: "problemProgress",
    name: "Problem Progress by Difficulty",
    description:
      "Offers a detailed breakdown of a user's problem progress by difficulty level (Easy, Medium, Hard).",
    icon: TrendingUp,
    category: "Progress",
    query: "userProfileUserQuestionProgress",
    requiresAuth: false,
    variables: { userSlug: "String!" },
    graphql: `query userProfileUserQuestionProgress($userSlug: String!) {
  userProfileUserQuestionProgress(userSlug: $userSlug) {
    numAcceptedQuestions { difficulty count }
    numFailedQuestions { difficulty count }
    numUntouchedQuestions { difficulty count }
  }
}`,
  },
  {
    id: "submissionStats",
    name: "Overall Submission Statistics",
    description:
      "Provides overall submission statistics and problem counts by difficulty.",
    icon: TrendingUp,
    category: "Statistics",
    query: "userProblemsSolved",
    requiresAuth: false,
    variables: { username: "String!" },
    graphql: `query userProblemsSolved($username: String!) {
  allQuestionsCount { difficulty count }
  matchedUser(username: $username) {
    submitStats {
      acSubmissionNum { difficulty count submissions }
      totalSubmissionNum { difficulty count submissions }
    }
  }
}`,
  },
  {
    id: "userCalendar",
    name: "User Submission Calendar",
    description:
      "Fetches a user's activity calendar, including active years, streaks, total active days, and submission counts.",
    icon: Calendar,
    category: "Activity",
    query: "userProfileCalendar",
    requiresAuth: false,
    variables: { username: "String!" },
    graphql: `query userProfileCalendar($username: String!) {
  matchedUser(username: $username) {
    userCalendar {
      activeYears
      streak
      totalActiveDays
      submissionCalendar
    }
  }
}`,
  },
  {
    id: "recentSubmissions",
    name: "Recent Accepted Submissions",
    description:
      "Lists a specified number of a user's most recently accepted (solved) problems.",
    icon: Code,
    category: "Activity",
    query: "recentAcSubmissions",
    requiresAuth: false,
    variables: { username: "String!", limit: "Int!" }, 
    graphql: `query recentAcSubmissions($username: String!, $limit: Int!) {
  recentAcSubmissionList(username: $username, limit: $limit) {
    id title titleSlug timestamp
  }
}`,
  },
  {
    id: "dailyChallenge",
    name: "Daily Coding Challenge Information",
    description:
      "Retrieves comprehensive details about the current day's Daily Coding Challenge question.",
    icon: Calendar,
    category: "Challenge",
    query: "questionOfToday",
    requiresAuth: false,
    variables: {}, 
    graphql: `query questionOfToday {
  activeDailyCodingChallengeQuestion {
    date
    link
    question {
      titleSlug
      title
      difficulty
      frontendQuestionId: questionFrontendId
      status
      topicTags { name id slug }
    }
  }
}`,
  },
  {
    id: "upcomingContests",
    name: "Upcoming Contests",
    description: "Retrieves information about all upcoming contests.",
    icon: Trophy,
    category: "Contest",
    query: "getContests",
    requiresAuth: false,
    variables: {}, 
    graphql: `query getContests {
  allContests {
    title
    titleSlug
    startTime
    duration
    isVirtual
  }
}`,
  },
];

export const limitedEndpoints: Endpoint[] = [
  {
    id: "streakCounter",
    name: "User Streak Counter",
    description:
      "Retrieves current daily streak information for the authenticated user.",
    icon: Calendar,
    category: "Activity",
    query: "getStreakCounter",
    requiresAuth: true,
    variables: {},
    graphql: `query getStreakCounter {
  streakCounter {
    streakCount
    daysSkipped
    currentDayCompleted
  }
}`,
  },
  {
    id: "currentTimestamp",
    name: "Current Server Timestamp",
    description:
      "Gets the current server timestamp in Unix epoch seconds (with milliseconds).",
    icon: Clock,
    category: "System",
    query: "currentTimestamp",
    requiresAuth: false,
    variables: {},
    graphql: `query currentTimestamp {
  currentTimestamp
}`,
  },
  {
    id: "activeBadge",
    name: "Active User Badge Information",
    description:
      "Specifically fetches details about a user's currently active badge.",
    icon: Award,
    category: "Profile",
    query: "getUserProfile",
    requiresAuth: false,
    variables: { username: "String!" },
    graphql: `query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    activeBadge { displayName icon }
  }
}`,
  },
  {
    id: "challengeMedal",
    name: "Daily Coding Challenge Medal Information",
    description:
      "Provides the name and icon configuration for a Daily Coding Challenge medal for a specific year and month.",
    icon: Medal,
    category: "Challenge",
    query: "codingChallengeMedal",
    requiresAuth: true,
    variables: { year: "Int!", month: "Int!" },
    graphql: `query codingChallengeMedal($year: Int!, $month: Int!) {
  dailyChallengeMedal(year: $year, month: $month) {
    name
    config { icon }
  }
}`,
  },
  {
    id: "userBadges",
    name: "User Badges Information",
    description:
      "Fetches information about a user's earned badges and upcoming badges.",
    icon: Award,
    category: "Profile",
    query: "userBadges",
    requiresAuth: false,
    variables: { username: "String!" },
    graphql: `query userBadges($username: String!) {
  matchedUser(username: $username) {
    badges {
      id name displayName icon hoverText
      creationDate category
    }
    upcomingBadges { name icon progress }
  }
}`,
  },
];
