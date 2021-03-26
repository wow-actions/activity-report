import moment from 'moment'
import { context } from '@actions/github'
import { octokit } from './octokit'
import { Await, Config } from './types'
import { Reactions } from './reactions'

export namespace Issues {
  export async function list(tailDate: string) {
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
    reactions: { [issue: number]: Reactions.ReactionsList },
    headDate: string,
    tailDate: string,
    config: Config,
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

      // For Liked issue
      // ---------------
      if (config.topLikedIssues > 0) {
        const likeMap: { [issue: number]: number } = {}
        const likeTypes = ['+1', 'laugh', 'hooray', 'heart', 'rocket']

        data.forEach((issue) => {
          likeMap[issue.number] = reactions[issue.number].reduce(
            (memo, { content }) => memo + (likeTypes.includes(content) ? 1 : 0),
            0,
          )
        })

        const likedIssues = data
          .filter((issue) => likeMap[issue.number] > 0)
          .sort((a, b) => likeMap[b.number] - likeMap[a.number])
          .slice(0, config.topLikedIssues)

        if (likedIssues.length > 0) {
          const temp: string[] = [
            likedIssues.length > 1
              ? `## TOP ${likedIssues.length} LIKED ISSUES`
              : '## MOST LIKED ISSUE',
          ]

          const details = (issue: IssueList[0]) => {
            let plus = 0
            let laugh = 0
            let hooray = 0
            let heart = 0
            let rocket = 0
            reactions[issue.number].forEach(({ content }) => {
              if (content === '+1') {
                plus += 1
              } else if (content === 'laugh') {
                laugh += 1
              } else if (content === 'hooray') {
                hooray += 1
              } else if (content === 'heart') {
                heart += 1
              } else if (content === 'rocket') {
                rocket += 1
              }
            })

            const result: string[] = []
            if (plus > 0) {
              result.push(`:+1: x${plus}`)
            }

            if (laugh > 0) {
              result.push(`:smile: x${laugh}`)
            }

            if (hooray > 0) {
              result.push(`:tada: x${hooray}`)
            }

            if (heart > 0) {
              result.push(`:heart: x${heart}`)
            }

            if (rocket > 0) {
              result.push(`:rocket: x${rocket}`)
            }

            return result.join(', ')
          }

          if (likedIssues.length === 1) {
            const issue = likedIssues[0]
            temp.push(`:+1: ${link(issue)}, by ${user(issue)}`)
            temp.push(`It received ${details(issue)}.`)
          } else {
            likedIssues.forEach((issue) => {
              temp.push(
                `:+1: ${link(issue)}, by ${user(issue)}, received ${details(
                  issue,
                )}.`,
              )
            })
          }

          result += temp.join('\n')
        }
      }

      // For Hot issue
      // ---------------
      if (config.topHotIssues > 0) {
        const hotIssues = data
          .filter((item) => item.comments > 0)
          .sort((a, b) => b.comments - a.comments)
          .slice(0, config.topHotIssues)

        if (hotIssues.length > 0) {
          const temp: string[] = [
            hotIssues.length > 1
              ? `## TOP ${hotIssues.length} HOT ISSUES`
              : '## HOTTEST ISSUE',
          ]

          if (hotIssues.length === 1) {
            const issue = hotIssues[0]
            temp.push(`:speaker: ${link(issue)}, by ${user(issue)}`)
            temp.push(`It received ${issue.comments} comments.`)
          } else {
            hotIssues.forEach((issue) => {
              temp.push(
                `:speaker: ${link(issue)}, by ${user(issue)}, received ${
                  issue.comments
                } comments.`,
              )
            })
          }

          result += temp.join('\n')
        }
      }
    }

    return result
  }
}
