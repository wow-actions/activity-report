import moment from 'moment'
import { context } from '@actions/github'
import { octokit } from './octokit'
import { Await, Config, Timespan } from './types'
import { Reactions } from './reactions'
import { Util } from './util'

export namespace Issues {
  export async function list(fromDate: string) {
    const issues = await octokit.paginate(octokit.issues.listForRepo, {
      ...context.repo,
      state: 'all',
      since: fromDate,
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

  export function render(
    issueList: IssueList = [],
    reactions: { [issue: number]: Reactions.ReactionsList },
    timespan: Timespan,
    config: Config,
  ) {
    const fromDate = timespan.toDateString
    const toDate = timespan.fromDateString
    let result = `${renderTitle(timespan, config)}\n`

    const issues = issueList.filter(
      (issue) =>
        moment(issue.created_at).isBetween(toDate, fromDate) &&
        issue.user!.login !== 'weekly-digest[bot]',
    )

    result += `${renderSummary(timespan, config, issues)}\n`

    if (issues.length > 0) {
      const openIssues = issues.filter((issue) => issue.state === 'open')
      const closedIssues = issues.filter((issue) => issue.state === 'closed')
      result += `${renderStatistics(
        timespan,
        config,
        issues,
        openIssues,
        closedIssues,
      )}\n`

      if (openIssues.length > 0) {
        const temp: string[] = [
          renderOpenIssuesTitle(timespan, config, openIssues, issues),
        ]

        openIssues.forEach((issue) => {
          temp.push(
            renderOpenIssuesItem(timespan, config, issue, openIssues, issues),
          )
        })

        result += temp.join('\n')
      }

      if (closedIssues.length > 0) {
        const temp: string[] = [
          renderClosedIssuesTitle(timespan, config, closedIssues, issues),
        ]
        closedIssues.forEach((issue) => {
          temp.push(
            renderClosedIssuesItem(
              timespan,
              config,
              issue,
              closedIssues,
              issues,
            ),
          )
        })
        result += temp.join('\n')
      }

      // For Liked issue
      // ---------------
      if (config.publishTopLikedIssues > 0) {
        const likeMap: { [issue: number]: number } = {}
        const likeTypes = ['+1', 'laugh', 'hooray', 'heart', 'rocket']

        issues.forEach((issue) => {
          likeMap[issue.number] = reactions[issue.number].reduce(
            (memo, { content }) => memo + (likeTypes.includes(content) ? 1 : 0),
            0,
          )
        })

        const likedIssues = issues
          .filter((issue) => likeMap[issue.number] > 0)
          .sort((a, b) => likeMap[b.number] - likeMap[a.number])
          .slice(0, config.publishTopLikedIssues)

        if (likedIssues.length > 0) {
          const detail = (issue: IssueList[0]) => {
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

          const details = likedIssues.map((issue) => detail(issue))
          result += [
            renderLikedIssuesTitle(timespan, config, likedIssues, issues),
            renderLikedIssuesDetail(
              timespan,
              config,
              details,
              likedIssues,
              issues,
            ),
          ].join('\n')
        }
      }

      // For Hot issue
      // ---------------
      if (config.publishTopHotIssues > 0) {
        const hotIssues = issues
          .filter((item) => item.comments > 0)
          .sort((a, b) => b.comments - a.comments)
          .slice(0, config.publishTopHotIssues)

        if (hotIssues.length > 0) {
          result += [
            renderHotIssuesTitle(timespan, config, hotIssues, issues),
            renderHotIssuesDetail(timespan, config, hotIssues, issues),
          ].join('\n')
        }
      }
    }

    return result
  }

  type IssueList = Await<ReturnType<typeof list>>

  function renderTitle(timespan: Timespan, config: Config) {
    return Util.render(config.templateIssuesTitle, timespan)
  }

  function renderSummary(
    timespan: Timespan,
    config: Config,
    issues: IssueList,
  ) {
    return Util.render(config.templateIssuesSummary, timespan, { issues })
  }

  function renderStatistics(
    timespan: Timespan,
    config: Config,
    issues: IssueList,
    openIssues: IssueList,
    closedIssues: IssueList,
  ) {
    return Util.render(config.templateIssuesStatistics, timespan, {
      issues,
      openIssues,
      closedIssues,
    })
  }

  function renderOpenIssuesTitle(
    timespan: Timespan,
    config: Config,
    openIssues: IssueList,
    issues: IssueList,
  ) {
    return Util.render(config.templateOpenIssuesTitle, timespan, {
      issues,
      openIssues,
    })
  }

  function renderOpenIssuesItem(
    timespan: Timespan,
    config: Config,
    issue: IssueList[0],
    openIssues: IssueList,
    issues: IssueList,
  ) {
    return Util.render(config.templateOpenIssuesItem, timespan, {
      issue,
      issues,
      openIssues,
    })
  }

  function renderClosedIssuesTitle(
    timespan: Timespan,
    config: Config,
    closedIssues: IssueList,
    issues: IssueList,
  ) {
    return Util.render(config.templateClosedIssuesTitle, timespan, {
      issues,
      closedIssues,
    })
  }

  function renderClosedIssuesItem(
    timespan: Timespan,
    config: Config,
    issue: IssueList[0],
    closedIssues: IssueList,
    issues: IssueList,
  ) {
    return Util.render(config.templateClosedIssuesItem, timespan, {
      issue,
      issues,
      closedIssues,
    })
  }

  function renderLikedIssuesTitle(
    timespan: Timespan,
    config: Config,
    likedIssues: IssueList,
    issues: IssueList,
  ) {
    return Util.render(config.templateLikedIssuesTitle, timespan, {
      issues,
      likedIssues,
    })
  }

  function renderLikedIssuesDetail(
    timespan: Timespan,
    config: Config,
    details: string[],
    likedIssues: IssueList,

    issues: IssueList,
  ) {
    return Util.render(config.templateLikedIssuesDetail, timespan, {
      issues,
      details,
      likedIssues,
    })
  }

  function renderHotIssuesTitle(
    timespan: Timespan,
    config: Config,
    hotIssues: IssueList,
    issues: IssueList,
  ) {
    return Util.render(config.templateHotIssuesTitle, timespan, {
      issues,
      hotIssues,
    })
  }

  function renderHotIssuesDetail(
    timespan: Timespan,
    config: Config,
    hotIssues: IssueList,
    issues: IssueList,
  ) {
    return Util.render(config.templateHotIssuesDetail, timespan, {
      issues,
      hotIssues,
    })
  }
}
