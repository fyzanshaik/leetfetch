# LeetCode Public GraphQL API Endpoints Documentation

## API Base URL

All requests are `POST` requests to this endpoint:

```
https://leetcode.com/graphql/
```

Each request body must include `query`, `variables` (if any), and `operationName`.

---

1. User Profile Information

- **Query Name:** `userPublicProfile`
- **Purpose:** Fetches basic user profile data, including contest badges, social media links, personal details, and activity counts (e.g., ranking, post views, reputation, solutions).
- **Variables:**
  ```json
  {
    "username": "String!"
  }
  ```
- **Payload (GraphQL):**
  ```graphql
  query userPublicProfile($username: String!) {
    matchedUser(username: $username) {
      contestBadge {
        name
        expired
        hoverText
        icon
      }
      username
      githubUrl
      twitterUrl
      linkedinUrl
      profile {
        ranking
        userAvatar
        realName
        aboutMe
        school
        websites
        countryName
        company
        jobTitle
        skillTags
        postViewCount
        postViewCountDiff
        reputation
        reputationDiff
        solutionCount
        solutionCountDiff
        categoryDiscussCount
        categoryDiscussCountDiff
        certificationLevel
      }
    }
  }
  ```

---

## 2. Programming Language Statistics

- **Query Name:** `languageStats`
- **Purpose:** Retrieves problems solved broken down by programming language.
- **Variables:**
  ```json
  {
    "username": "String!"
  }
  ```
- **Payload (GraphQL):**
  ```graphql
  query languageStats($username: String!) {
    matchedUser(username: $username) {
      languageProblemCount {
        languageName
        problemsSolved
      }
    }
  }
  ```

---

## 3. Problem-Solving Skills Statistics

- **Query Name:** `skillStats`
- **Purpose:** Provides problems solved categorized by skill areas (advanced, intermediate, fundamental).
- **Variables:**
  ```json
  {
    "username": "String!"
  }
  ```
- **Payload (GraphQL):**
  ```graphql
  query skillStats($username: String!) {
    matchedUser(username: $username) {
      tagProblemCounts {
        advanced {
          tagName
          tagSlug
          problemsSolved
        }
        intermediate {
          tagName
          tagSlug
          problemsSolved
        }
        fundamental {
          tagName
          tagSlug
          problemsSolved
        }
      }
    }
  }
  ```

---

## 4. Contest History and Rankings

- **Query Name:** `userContestRankingInfo`
- **Purpose:** Gathers a user's contest participation history and ranking details.
- **Variables:**
  ```json
  {
    "username": "String!"
  }
  ```
- **Payload (GraphQL):**
  ```graphql
  query userContestRankingInfo($username: String!) {
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
      badge {
        name
      }
    }
    userContestRankingHistory(username: $username) {
      attended
      trendDirection
      problemsSolved
      totalProblems
      finishTimeInSeconds
      rating
      ranking
      contest {
        title
        startTime
      }
    }
  }
  ```

---

## 5. Problem Progress by Difficulty

- **Query Name:** `userProfileUserQuestionProgressV2`
- **Purpose:** Offers a detailed breakdown of a user's problem progress by difficulty level (Easy, Medium, Hard).
- **Variables:**
  ```json
  {
    "userSlug": "String!"
  }
  ```
- **Payload (GraphQL):**
  ```graphql
  query userProfileUserQuestionProgressV2($userSlug: String!) {
    userProfileUserQuestionProgressV2(userSlug: $userSlug) {
      numAcceptedQuestions {
        count
        difficulty
      }
      numFailedQuestions {
        count
        difficulty
      }
      numUntouchedQuestions {
        count
        difficulty
      }
      userSessionBeatsPercentage {
        difficulty
        percentage
      }
      totalQuestionBeatsPercentage
    }
  }
  ```

---

## 6. Overall Submission Statistics

- **Query Name:** `userSessionProgress`
- **Purpose:** Provides overall submission statistics and problem counts by difficulty.
- **Variables:**
  ```json
  {
    "username": "String!"
  }
  ```
- **Payload (GraphQL):**
  ```graphql
  query userSessionProgress($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
  }
  ```

---

## 7. Global User Status Information

- **Query Name:** `globalData`
- **Purpose:** Retrieves the status and basic information of the currently authenticated user.
- **Variables:**
  ```json
  {}
  ```
- **Payload (GraphQL):**
  ```graphql
  query globalData {
    userStatus {
      userId
      isSignedIn
      isMockUser
      isPremium
      isVerified
      username
      realName
      avatar
      isAdmin
      isSuperuser
      permissions
      isTranslator
      activeSessionId
      checkedInToday
      completedFeatureGuides
      notificationStatus {
        lastModified
        numUnread
      }
    }
  }
  ```

---

## 8. User Submission Calendar

- **Query Name:** `userProfileCalendar`
- **Purpose:** Fetches a user's activity calendar, including active years, streaks, total active days, Daily Coding Challenge badges, and detailed submission counts per day.
- **Variables:**
  ```json
  {
    "username": "String!",
    "year": "Int" (Optional: if null, defaults to current/recent active years)
  }
  ```
- **Payload (GraphQL):**
  ```graphql
  query userProfileCalendar($username: String!, $year: Int) {
    matchedUser(username: $username) {
      userCalendar(year: $year) {
        activeYears
        streak
        totalActiveDays
        dccBadges {
          timestamp
          badge {
            name
            icon
          }
        }
        submissionCalendar # Returns a JSON string, requires parsing
      }
    }
  }
  ```

---

## 9. Recent Accepted Submissions

- **Query Name:** `recentAcSubmissions`
- **Purpose:** Lists a specified number of a user's most recently accepted (solved) problems.
- **Variables:**
  ```json
  {
    "username": "String!",
    "limit": "Int!"
  }
  ```
- **Payload (GraphQL):**
  ```graphql
  query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
    }
  }
  ```

---

## 10. User Streak Counter

- **Query Name:** `getStreakCounter`
- **Purpose:** Retrieves current daily streak information for the authenticated user.
- **Variables:**
  ```json
  {}
  ```
- **Payload (GraphQL):**
  ```graphql
  query getStreakCounter {
    streakCounter {
      streakCount
      daysSkipped
      currentDayCompleted
    }
  }
  ```

---

## 11. Current Server Timestamp

- **Query Name:** `currentTimestamp`
- **Purpose:** Gets the current server timestamp in Unix epoch seconds (with milliseconds).
- **Variables:**
  ```json
  {}
  ```
- **Payload (GraphQL):**
  ```graphql
  query currentTimestamp {
    currentTimestamp
  }
  ```

---

## 12. Daily Coding Challenge Information

- **Query Name:** `questionOfToday`
- **Purpose:** Retrieves comprehensive details about the current day's Daily Coding Challenge question.
- **Variables:**
  ```json
  {}
  ```
- **Payload (GraphQL):**
  ```graphql
  query questionOfToday {
    activeDailyCodingChallengeQuestion {
      date
      userStatus
      link
      question {
        titleSlug
        title
        translatedTitle
        acRate
        difficulty
        freqBar
        frontendQuestionId: questionFrontendId
        isFavor
        paidOnly: isPaidOnly
        status
        hasVideoSolution
        hasSolution
        topicTags {
          name
          id
          slug
        }
      }
    }
  }
  ```

---

## 13. Active User Badge Information

- **Query Name:** `getUserProfile`
- **Purpose:** Specifically fetches details about a user's currently active badge.
- **Variables:**
  ```json
  {
    "username": "String!"
  }
  ```
- **Payload (GraphQL):**
  ```graphql
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      activeBadge {
        displayName
        icon
      }
    }
  }
  ```

---

## 14. Daily Coding Challenge Medal Information

- **Query Name:** `codingChallengeMedal`
- **Purpose:** Provides the name and icon configuration for a Daily Coding Challenge medal for a specific year and month.
- **Variables:**
  ```json
  {
    "year": "Int!",
    "month": "Int!"
  }
  ```
- **Payload (GraphQL):**
  ```graphql
  query codingChallengeMedal($year: Int!, $month: Int!) {
    dailyChallengeMedal(year: $year, month: $month) {
      name
      config {
        icon
      }
    }
  }
  ```

---

## 15. User Badges Information

- **Query Name:** `userBadges`
- **Purpose:** Fetches information about a user's earned badges and upcoming badges.
- **Variables:**
  ```json
  {
    "username": "String!"
  }
  ```
- **Payload (GraphQL):**
  ```graphql
  query userBadges($username: String!) {
    matchedUser(username: $username) {
      badges {
        id
        name
        shortName
        displayName
        icon
        hoverText
        medal {
          slug
          config {
            iconGif
            iconGifBackground
          }
        }
        creationDate
        category
      }
      upcomingBadges {
        name
        icon
        progress
      }
    }
  }
  ```

---

## 16. Upcoming Contests (For Future Implementation)

- **Query Name:** `getContests`
- **Purpose:** Retrieves information about all upcoming contests.
- **Variables:**
  ```json
  {}
  ```
- **Payload (GraphQL):**
  ```graphql
  query getContests {
    allContests {
      title
      titleSlug
      startTime
      duration
      originStartTime
      isVirtual
      company {
        name
        slug
      }
    }
  }
  ```
