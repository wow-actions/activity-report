import moment from 'moment'
import { context } from '@actions/github'
import { octokit } from './octokit'
import { Await } from './types'

export namespace Issues {
  export async function list(tailDate: string) {
    octokit.issues.get()
    const issues = await octokit.paginate(octokit.issues.listForRepo, {
      ...context.repo,
      state: 'all',
      since: tailDate,
      per_page: 100,
    })
    return issues
  }

  export async function create(title: string, body: string, labels?: string[]) {
    return octokit.issues.create({
      ...context.repo,
      title,
      body,
      labels,
    })
  }

  export async function search({
    type,
    author,
    date,
  }: {
    type: string
    author: string
    date: string
  }) {
    const { repo, owner } = context.repo
    const res = await octokit.search.issuesAndPullRequests({
      q: `repo:${owner}/${repo} type:${type} author:${author} created:>=${date}`,
      per_page: 100,
    })
    return res
  }

  type IssueList = Await<ReturnType<typeof list>>

  const link = (issue: IssueList[0]) =>
    `#${issue.number} [${issue.title.replace(/\n/g, ' ')}](${issue.html_url})`

  const user = (issue: IssueList[0]) =>
    `[${issue.user!.login}](${issue.user!.html_url})`

  export function render(
    issues: IssueList = [],
    headDate: string,
    tailDate: string,
  ) {
    let result = '# ISSUES\n'

    const data = issues.filter(
      (issue) =>
        moment(issue.created_at).isBetween(tailDate, headDate) &&
        issue.user!.login !== 'weekly-digest[bot]',
    )

    const total = data.length
    if (total === 0) {
      result += 'Last week, no issues were created.\n'
    } else {
      if (total === 1) {
        result += `Last week ${total} issue was created.\n`
      } else {
        result += `Last week ${total} issues were created.\n`
      }

      const openIssues = data.filter((issue) => issue.state === 'open')
      const closedIssues = data.filter((issue) => issue.state === 'closed')

      if (total === 1 && openIssues.length === 1) {
        result += 'It is still open.\n'
      } else if (total === openIssues.length && openIssues.length > 1) {
        result += 'They are still open.\n'
      } else if (total === 1 && closedIssues.length === 1) {
        result += 'It is closed now.\n'
      } else if (total === closedIssues.length && closedIssues.length > 1) {
        result += 'They are all have been closed.\n'
      } else if (total > 0) {
        result += `Of these, `

        if (closedIssues.length > 0) {
          if (closedIssues.length === 1) {
            result += `${closedIssues.length} issue has been closed`
          } else {
            result += `${closedIssues.length} issues have been closed`
          }

          if (openIssues.length > 0) {
            result += ' and '
          }
        }

        if (openIssues.length > 0) {
          if (openIssues.length === 1) {
            result += `${openIssues.length} issue is still open`
          } else {
            result += `${openIssues.length} issues are still open`
          }
        }

        result += '.\n'
      }

      if (openIssues.length > 0) {
        const temp: string[] = ['## OPEN ISSUES']
        openIssues.forEach((issue) => {
          temp.push(`:green_heart: ${link(issue)}, by ${user(issue)}`)
        })
        result += temp.join('\n')
      }

      if (closedIssues.length > 0) {
        const temp: string[] = ['## CLOSED ISSUES']
        closedIssues.forEach((issue) => {
          temp.push(`:heart: ${link(issue)}, by ${user(issue)}`)
        })
        result += temp.join('\n')
      }

      // To get the most recent liked or noisy issue
      // -------------------------------------------

      // const likedIssueStrings: string[] = []
      // const noisyIssueStrings: string[] = []
      // data.reverse()

      // // For Liked issue
      // // ---------------
      // const likedIssues = data.filter(
      //   (item) =>
      //     item.reactions['+1'] +
      //       item.reactions.laugh +
      //       item.reactions.hooray +
      //       item.reactions.heart >
      //     0,
      // )

      // if (likedIssues.length > 0) {
      //   likedIssueStrings.push('## LIKED ISSUE')
      //   let likedIssue = likedIssues[0]
      //   likedIssues.forEach((issue) => {
      //     if (
      //       issue.reactions['+1'] +
      //         issue.reactions.laugh +
      //         issue.reactions.hooray +
      //         issue.reactions.heart >
      //       likedIssue.reactions['+1'] +
      //         likedIssue.reactions.laugh +
      //         likedIssue.reactions.hooray +
      //         likedIssue.reactions.heart
      //     ) {
      //       likedIssue = issue
      //     }
      //   })
      //   likedIssueStrings.push(
      //     `:+1: ${link(likedIssue)}, by ${user(likedIssue)}`,
      //   )
      //   likedIssueStrings.push(
      //     `It received :+1: x${likedIssue.reactions['+1']}, :smile: x${likedIssue.reactions.laugh}, :tada: x${likedIssue.reactions.hooray} and :heart: x${likedIssue.reactions.heart}.`,
      //   )
      // }

      // if (likedIssueStrings.length > 0) {
      //   result += likedIssueStrings.join('\n')
      // }

      // // For Noisy issue
      // // ---------------
      // const noisyIssues = data.filter((item) => item.comments > 0)
      // if (noisyIssues.length > 0) {
      //   noisyIssueStrings.push('## NOISY ISSUE')
      //   let noisyIssue = noisyIssues[0]
      //   noisyIssues.forEach((item) => {
      //     if (item.comments > noisyIssue.comments) {
      //       noisyIssue = item
      //     }
      //   })
      //   noisyIssueStrings.push(
      //     `:speaker: ${link(noisyIssue)}, by ${user(noisyIssue)}`,
      //   )

      //   noisyIssueStrings.push(`It received ${noisyIssue.comments} comments.\n`)
      // }

      // if (noisyIssueStrings.length > 0) {
      //   result += noisyIssueStrings.join('\n')
      // }
    }

    return result
  }
}
