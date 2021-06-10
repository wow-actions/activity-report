import moment from 'moment'
import { context } from '@actions/github'
import { Util } from './util'
import { octokit } from './octokit'
import { Await, Config, Timespan } from './types'

export namespace Commits {
  export async function list(fromDate: string) {
    const commits = await octokit.paginate(octokit.repos.listCommits, {
      ...context.repo,
      state: 'all',
      since: fromDate,
      per_page: 100,
    })
    return commits
  }

  type CommitList = Await<ReturnType<typeof list>>

  const commitLink = (commit: CommitList[0]) =>
    `[${commit.commit.message.replace(/\n/g, ' ')}](${commit.html_url})`

  const userLink = (commit: CommitList[0]) =>
    commit.author ? `[${commit.author.login}](${commit.author.html_url})` : ''

  export function render(
    commitList: CommitList = [],
    timespan: Timespan,
    config: Config,
  ) {
    const { fromDate, toDate } = timespan
    const commits = commitList.filter((item) =>
      moment(item.commit.committer!.date).isBetween(fromDate, toDate),
    )
    const result: string[] = []

    result.push(
      renderCommitsTitle(timespan, config, commits),
      renderCommitssSummary(timespan, config, commits),
      commits
        .map((commit) => renderCommitsItem(timespan, config, commit, commits))
        .join('\n'),
    )

    return result.join('\n')
  }

  export function renderContributors(
    commits: CommitList = [],
    timespan: Timespan,
    config: Config,
  ) {
    const { fromDate } = timespan
    const { toDate } = timespan
    const contributors = commits.filter((item) =>
      moment(item.commit.committer!.date).isBetween(fromDate, toDate),
    )

    const result: string[] = []
    const cache: { login: string; url: string }[] = []
    contributors.forEach((item) => {
      cache.push({
        login: item.author!.login,
        url: item.author!.html_url,
      })
    })

    const uniques: {
      login: string
      url: string
    }[] = Object.values(
      cache.reduce((acc, cul) => Object.assign(acc, { [cul.login]: cul }), {}),
    )

    result.push(
      renderContributorsTitle(timespan, config, uniques),
      renderContributorssSummary(timespan, config, uniques),
      uniques
        .map((contributor) =>
          renderContributorsItem(timespan, config, contributor, uniques),
        )
        .join('\n'),
    )

    return result.join('\n')
  }

  function renderCommitsTitle(
    timespan: Timespan,
    config: Config,
    commits: CommitList,
  ) {
    return Util.render(
      config.templateCommitsTitle,
      timespan,
      {
        commits,
      },
      true,
    )
  }

  function renderCommitssSummary(
    timespan: Timespan,
    config: Config,
    commits: CommitList,
  ) {
    return Util.render(
      config.templateCommitsSummary,
      timespan,
      {
        commits,
      },
      true,
    )
  }

  function renderCommitsItem(
    timespan: Timespan,
    config: Config,
    commit: CommitList[0],
    commits: CommitList,
  ) {
    return Util.render(
      config.templateCommitsItem,
      timespan,
      {
        commit,
        commits,
        commitLink: commitLink(commit),
        userLink: userLink(commit),
      },
      true,
    )
  }

  function renderContributorsTitle(
    timespan: Timespan,
    config: Config,
    contributors: { login: string; url: string }[],
  ) {
    return Util.render(
      config.templateContributorsTitle,
      timespan,
      {
        contributors,
      },
      true,
    )
  }

  function renderContributorssSummary(
    timespan: Timespan,
    config: Config,
    contributors: { login: string; url: string }[],
  ) {
    return Util.render(
      config.templateContributorsSummary,
      timespan,
      {
        contributors,
      },
      true,
    )
  }

  function renderContributorsItem(
    timespan: Timespan,
    config: Config,
    contributor: { login: string; url: string },
    contributors: { login: string; url: string }[],
  ) {
    return Util.render(
      config.templateContributorsItem,
      timespan,
      {
        contributor,
        contributors,
        userLink: `[${contributor.login}](${contributor.url})`,
      },
      true,
    )
  }
}
