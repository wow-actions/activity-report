import moment from 'moment'
import { context } from '@actions/github'
import { octokit } from './octokit'
import { Await } from './types'

export namespace PullRequests {
  export async function list() {
    const prs = await octokit.paginate(octokit.pulls.list, {
      ...context.repo,
      state: 'all',
      per_page: 100,
    })
    return prs
  }

  type PullRequestList = Await<ReturnType<typeof list>>

  const link = (pr: PullRequestList[0]) =>
    `#${pr.number} [${pr.title.replace(/\n/g, ' ')}](${pr.html_url})`

  const user = (pr: PullRequestList[0]) =>
    `[${pr.user!.login}](${pr.user!.html_url})`

  export function render(
    pullRequests: PullRequestList = [],
    headDate: string,
    tailDate: string,
  ) {
    let result = '# PULL REQUESTS\n'
    const data = pullRequests.filter(
      (pr) =>
        (pr.state === 'open' &&
          pr.merged_at == null &&
          moment(pr.created_at).isBetween(tailDate, headDate) &&
          moment(pr.created_at).isSame(pr.updated_at)) ||
        (pr.state === 'open' &&
          pr.merged_at == null &&
          moment(pr.updated_at).isBetween(tailDate, headDate)) ||
        (moment(pr.merged_at).isBetween(tailDate, headDate) &&
          pr.state === 'closed'),
    )

    const total = data.length

    if (total === 0) {
      result += 'Last week, no pull requests were created, updated or merged.\n'
    } else {
      if (total === 1) {
        result += `Last week ${total} pull request was created, updated or merged.\n`
      } else {
        result += `Last week ${total} pull requests were created, updated or merged.\n`
      }

      const opens = data.filter(
        (pr) =>
          moment(pr.created_at).isBetween(tailDate, headDate) &&
          moment(pr.created_at).isSame(pr.updated_at) &&
          pr.merged_at == null,
      )

      const updates = data.filter(
        (pr) =>
          moment(pr.updated_at).isBetween(tailDate, headDate) &&
          !moment(pr.updated_at).isSame(pr.created_at) &&
          pr.merged_at == null,
      )

      const merges = data.filter(
        (pr) =>
          pr.merged_at != null &&
          moment(pr.merged_at).isBetween(tailDate, headDate),
      )

      if (opens.length > 0) {
        const temp: string[] = ['## OPEN PULL REQUEST']
        if (opens.length === 1) {
          temp.push(`Last week, ${opens.length} pull request was opened.`)
        } else {
          temp.push(`Last week, ${opens.length} pull requests were opened.`)
        }
        opens.forEach((pr) => {
          temp.push(`:green_heart: ${link(pr)}, by ${user(pr)}`)
        })
        result += temp.join('\n')
      }

      if (updates.length > 0) {
        const temp: string[] = ['## UPDATED PULL REQUEST']
        if (updates.length === 1) {
          temp.push(`Last week, ${updates.length} pull request was updated.`)
        } else {
          temp.push(`Last week, ${updates.length} pull requests were updated.`)
        }
        updates.forEach((pr) => {
          temp.push(`:yellow_heart: ${link(pr)}, by ${user(pr)}`)
        })
        result += temp.join('\n')
      }

      if (merges.length > 0) {
        const temp: string[] = ['## MERGED PULL REQUEST']
        if (merges.length === 1) {
          temp.push(`Last week, ${merges.length} pull request was merged.`)
        } else {
          temp.push(`Last week, ${merges.length} pull requests were merged.`)
        }
        merges.forEach((pr) => {
          temp.push(`:purple_heart: ${link(pr)}, by ${user(pr)}`)
        })
        result += temp.join('\n')
      }
    }

    return result
  }
}
