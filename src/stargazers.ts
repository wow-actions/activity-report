import moment from 'moment'
import { context } from '@actions/github'
import { octokit } from './octokit'
import { Await } from './types'

export namespace Stargazers {
  export async function list() {
    const stargazers = await octokit.paginate(
      octokit.activity.listStargazersForRepo,
      {
        ...context.repo,
        per_page: 100,
      },
    )
    return stargazers
  }

  type StargazerList = Await<ReturnType<typeof list>>

  export function render(
    stargazers: StargazerList = [],
    headDate: string,
    tailDate: string,
  ) {
    let result = '# STARGAZERS\n'
    const data = stargazers.filter(
      (item) =>
        item != null && moment(item.starred_at).isBetween(tailDate, headDate),
    )

    const total = data.length
    if (total === 0) {
      result += 'Last week there were no stargazers.\n'
    } else {
      if (total === 1) {
        result += `Last week there was ${total} stargazer.\n`
      } else {
        result += `Last week there were ${total} stargazers.\n`
      }

      data.forEach((item) => {
        result += `:star: [${item!.login}](${item!.html_url})\n`
      })

      if (total === 1) {
        result += 'You are the star! :star2:\n'
      } else {
        result += 'You all are the stars! :star2:\n'
      }
    }
    return result
  }
}
