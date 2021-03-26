import moment from 'moment'
import { context } from '@actions/github'
import { octokit } from './octokit'
import { Util } from './util'
import { Reactions } from './reactions'
import { Await, Config, Timespan } from './types'

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

  const issueLink = (issue: IssueList[0]) =>
    `#${issue.number} [${issue.title.replace(/\n/g, ' ')}](${issue.html_url})`

  const userLink = (issue: IssueList[0]) =>
    `[${issue.user!.login}](${issue.user!.html_url})`

  export function render(
    issueList: IssueList = [],
    reactions: { [issue: number]: Reactions.ReactionsList },
    timespan: Timespan,
    config: Config,
  ) {
    const result: string[] = []

    result.push(renderTitle(timespan, config))

    const issues = issueList.filter(
      (issue) =>
        issue.pull_request == null &&
        moment(issue.created_at).isBetween(
          timespan.fromDateString,
          timespan.toDateString,
        ) &&
        issue.user!.login !== 'weekly-digest[bot]',
    )

    result.push(renderSummary(timespan, config, issues))

    if (issues.length > 0) {
      const openIssues = issues.filter((issue) => issue.state === 'open')
      const closedIssues = issues.filter((issue) => issue.state === 'closed')
      result.push(
        renderStatistics(timespan, config, issues, openIssues, closedIssues),
      )

      if (openIssues.length > 0) {
        const section: string[] = [
          renderOpenIssuesTitle(timespan, config, openIssues, issues),
        ]

        openIssues.forEach((issue) => {
          section.push(
            renderOpenIssuesItem(timespan, config, issue, openIssues, issues),
          )
        })

        result.push(section.join('\n'))
      }

      if (closedIssues.length > 0) {
        const section: string[] = [
          renderClosedIssuesTitle(timespan, config, closedIssues, issues),
        ]
        closedIssues.forEach((issue) => {
          section.push(
            renderClosedIssuesItem(
              timespan,
              config,
              issue,
              closedIssues,
              issues,
            ),
          )
        })
        result.push(section.join('\n'))
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
          const reactionMap = (issue: IssueList[0]) => {
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

            return {
              laugh,
              hooray,
              heart,
              rocket,
              '+1': plus,
            }
          }

          result.push(
            [
              renderLikedIssuesTitle(timespan, config, likedIssues, issues),
              likedIssues
                .map((issue) =>
                  renderLikedIssuesItem(
                    timespan,
                    config,
                    issue,
                    reactionMap(issue),
                    likedIssues,
                    issues,
                  ),
                )
                .join('\n'),
            ].join('\n'),
          )
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
          result.push(
            [
              renderHotIssuesTitle(timespan, config, hotIssues, issues),
              hotIssues
                .map((issue) =>
                  renderHotIssuesItem(
                    timespan,
                    config,
                    issue,
                    hotIssues,
                    issues,
                  ),
                )
                .join('\n'),
            ].join('\n'),
          )
        }
      }
    }

    return result.join('\n')
  }

  type IssueList = Await<ReturnType<typeof list>>

  function renderTitle(timespan: Timespan, config: Config) {
    return Util.render(config.templateIssuesTitle, timespan, {}, true)
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
    return Util.render(
      config.templateIssuesStatistics,
      timespan,
      {
        issues,
        openIssues,
        closedIssues,
      },
      true,
    )
  }

  function renderOpenIssuesTitle(
    timespan: Timespan,
    config: Config,
    openIssues: IssueList,
    issues: IssueList,
  ) {
    return Util.render(
      config.templateOpenIssuesTitle,
      timespan,
      {
        issues,
        openIssues,
      },
      true,
    )
  }

  function renderOpenIssuesItem(
    timespan: Timespan,
    config: Config,
    issue: IssueList[0],
    openIssues: IssueList,
    issues: IssueList,
  ) {
    return Util.render(
      config.templateOpenIssuesItem,
      timespan,
      {
        issue,
        issues,
        openIssues,
        issueLink: issueLink(issue),
        userLink: userLink(issue),
      },
      true,
    )
  }

  function renderClosedIssuesTitle(
    timespan: Timespan,
    config: Config,
    closedIssues: IssueList,
    issues: IssueList,
  ) {
    return Util.render(
      config.templateClosedIssuesTitle,
      timespan,
      {
        issues,
        closedIssues,
      },
      true,
    )
  }

  function renderClosedIssuesItem(
    timespan: Timespan,
    config: Config,
    issue: IssueList[0],
    closedIssues: IssueList,
    issues: IssueList,
  ) {
    return Util.render(
      config.templateClosedIssuesItem,
      timespan,
      {
        issue,
        issues,
        closedIssues,
        issueLink: issueLink(issue),
        userLink: userLink(issue),
      },
      true,
    )
  }

  function renderLikedIssuesTitle(
    timespan: Timespan,
    config: Config,
    likedIssues: IssueList,
    issues: IssueList,
  ) {
    return Util.render(
      config.templateLikedIssuesTitle,
      timespan,
      {
        likedIssues,
        issues,
      },
      true,
    )
  }

  function renderLikedIssuesReaction(
    timespan: Timespan,
    config: Config,
    issue: IssueList[0],
    reactions: Record<string, number>,
    likedIssues: IssueList,
    issues: IssueList,
  ) {
    return Util.render(
      config.templateLikedIssuesReaction,
      timespan,
      {
        issue,
        issues,
        reactions,
        likedIssues,
      },
      true,
    )
  }

  function renderLikedIssuesItem(
    timespan: Timespan,
    config: Config,
    issue: IssueList[0],
    reactions: Record<string, number>,
    likedIssues: IssueList,
    issues: IssueList,
  ) {
    return Util.render(
      config.templateLikedIssuesItem,
      timespan,
      {
        issue,
        issues,
        likedIssues,
        reactions: renderLikedIssuesReaction(
          timespan,
          config,
          issue,
          reactions,
          likedIssues,
          issues,
        ),
        issueLink: issueLink(issue),
        userLink: userLink(issue),
      },
      true,
    )
  }

  function renderHotIssuesTitle(
    timespan: Timespan,
    config: Config,
    hotIssues: IssueList,
    issues: IssueList,
  ) {
    return Util.render(
      config.templateHotIssuesTitle,
      timespan,
      {
        issues,
        hotIssues,
      },
      true,
    )
  }

  function renderHotIssuesItem(
    timespan: Timespan,
    config: Config,
    issue: IssueList[0],
    hotIssues: IssueList,
    issues: IssueList,
  ) {
    return Util.render(
      config.templateHotIssuesItem,
      timespan,
      {
        issue,
        issues,
        hotIssues,
        issueLink: issueLink(issue),
        userLink: userLink(issue),
      },
      true,
    )
  }
}
