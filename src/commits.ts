import moment from 'moment'
import { context } from '@actions/github'
import { octokit } from './octokit'
import { Await } from './types'

export namespace Commits {
  export async function list(tailDate: string) {
    const commits = await octokit.paginate(octokit.repos.listCommits, {
      ...context.repo,
      state: 'all',
      since: tailDate,
      per_page: 100,
    })
    return commits
  }

  type CommitList = Await<ReturnType<typeof list>>

  const link = (commit: CommitList[0]) =>
    `[${commit.commit.message.replace(/\n/g, ' ')}](${commit.html_url})`

  const user = (commit: CommitList[0]) =>
    `[${commit.author!.login}](${commit.author!.html_url})`

  export function render(
    commits: CommitList = [],
    headDate: string,
    tailDate: string,
  ) {
    let result = '# COMMITS\n'
    const data = commits.filter(
      (item) =>
        moment(item.commit.committer!.date).isBetween(tailDate, headDate) &&
        item.author!.login !== 'weekly-digest[bot]',
    )

    const total = data.length
    if (total === 0) {
      result += 'Last week there were no commits.\n'
    } else {
      if (total === 1) {
        result += `Last week there was ${total} commit.\n`
      } else {
        result += `Last week there were ${total} commits.\n`
      }

      data.forEach((commit) => {
        result += `:hammer_and_wrench: ${link(commit)} by ${user(commit)}\n`
      })
    }

    return result
  }

  export function renderContributors(
    commits: CommitList = [],
    headDate: string,
    tailDate: string,
  ) {
    const data = commits.filter(
      (item) =>
        moment(item.commit.committer!.date).isBetween(tailDate, headDate) &&
        item.author!.login !== 'weekly-digest[bot]',
    )

    let result = '# CONTRIBUTORS\n'
    if (data.length === 0) {
      result += 'Last week there were no contributors.\n'
    } else {
      const contributors: { login: string; url: string }[] = []
      data.forEach((item) => {
        contributors.push({
          login: item.author!.login,
          url: item.author!.html_url,
        })
      })

      const uniques: {
        login: string
        url: string
      }[] = Object.values(
        contributors.reduce(
          (acc, cul) => Object.assign(acc, { [cul.login]: cul }),
          {},
        ),
      )

      const total = uniques.length
      if (total === 1) {
        result += `Last week there was ${total} contributor.\n`
      } else {
        result += `Last week there were ${total} contributors.\n`
      }

      uniques.forEach((u) => {
        result += `:bust_in_silhouette: [${u.login}](${u.url})\n`
      })
    }

    return result
  }
}
