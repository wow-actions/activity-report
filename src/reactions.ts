import { context } from '@actions/github'
import { octokit } from './octokit'
import { Await } from './types'

export namespace Reactions {
  export async function list(issue: number) {
    const reactions = await octokit.paginate(
      octokit.rest.reactions.listForIssue,
      {
        ...context.repo,
        issue_number: issue,
        per_page: 100,
      },
    )
    return reactions
  }

  export type ReactionsList = Await<ReturnType<typeof list>>

  export type Type =
    | '+1'
    | '-1'
    | 'laugh'
    | 'confused'
    | 'heart'
    | 'hooray'
    | 'rocket'
    | 'eyes'

  export async function map(issues: number[]) {
    const result: { [key: number]: ReactionsList } = {}

    // eslint-disable-next-line
    await Promise.all(issues.map((issue) => list(issue))).then((arr) => {
      arr.forEach((item, index) => {
        result[issues[index]] = item
      })
    })

    return result
  }
}
