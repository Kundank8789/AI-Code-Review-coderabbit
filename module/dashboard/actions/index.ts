"use server";

import { fetchUserContribution, getGithubToken } from "@/module/github/lib/github";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Octokit } from "octokit";

/* ---------- TYPES ---------- */
type ContributionDay = {
  date: string;
  contributionCount: number;
};

type ContributionWeek = {
  contributionDays: ContributionDay[];
};

type ContributionCalendar = {
  totalContributions: number;
  weeks: ContributionWeek[];
};

/* ---------- FUNCTIONS ---------- */

export async function getContributionStats() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    const { data: user } = await octokit.rest.users.getAuthenticated();

    if (!user.login) {
      throw new Error("GitHub username not found");
    }

    const calendar: ContributionCalendar | null =
      await fetchUserContribution(token, user.login);

    if (!calendar) return null;

    const contributions = calendar.weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: Math.min(4, Math.floor(day.contributionCount / 3)),
      }))
    );

    return {
      contributions,
      totalContributions: calendar.totalContributions,
    };

  } catch (error) {
    console.error("Error fetching contribution stats:", error);
    return null;
  }
}

export async function getDashboardStats() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    const { data: user } = await octokit.rest.users.getAuthenticated();

    if (!user.login) {
      throw new Error("GitHub username not found");
    }

    const calendar: ContributionCalendar | null =
      await fetchUserContribution(token, user.login);

    const totalCommits = calendar?.totalContributions ?? 0;

    const { data: prs } =
      await octokit.rest.search.issuesAndPullRequests({
        q: `author:${user.login} type:pr`,
        per_page: 1,
      });

    return {
      totalRepos: 30,
      totalPRs: prs.total_count,
      totalCommits,
      totalReview: 44,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalRepos: 0,
      totalPRs: 0,
      totalCommits: 0,
      totalReview: 0,
    };
  }
}

export async function getMonthlyActivity() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    const { data: user } = await octokit.rest.users.getAuthenticated();

    if (!user.login) {
      throw new Error("GitHub username not found");
    }

    const calendar: ContributionCalendar | null =
      await fetchUserContribution(token, user.login);

    if (!calendar) return [];

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthlyData: Record<
      string,
      { commits: number; prs: number; reviews: number }
    > = {};

    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthlyData[monthNames[d.getMonth()]] = {
        commits: 0,
        prs: 0,
        reviews: 0,
      };
    }

    calendar.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        const date = new Date(day.date);
        const key = monthNames[date.getMonth()];
        if (monthlyData[key]) {
          monthlyData[key].commits += day.contributionCount;
        }
      });
    });

    return Object.entries(monthlyData).map(([name, data]) => ({
      name,
      ...data,
    }));
  } catch (error) {
    console.error("Error fetching monthly activity:", error);
    return [];
  }
}
