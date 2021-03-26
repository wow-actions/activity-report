import * as core from '@actions/core'
import { Util } from './util'
import { Config, Timespan } from './types'
import { Issues } from './issues'
import { Commits } from './commits'
import { Releases } from './releases'
import { Reactions } from './reactions'
import { Stargazers } from './stargazers'
import { PullRequests } from './pulls'

export namespace Renderer {
  export function renderTitle(timespan: Timespan, config: Config) {
    return Util.render(config.templateTitle, timespan, {
      fromDate: Util.formatDateInTitle(timespan.fromDateString),
      toDate: Util.formatDateInTitle(timespan.toDateString),
    })
  }

  export async function renderBody(timespan: Timespan, config: Config) {
    let body = renderHeader(timespan, config)

    let issuesString: string | undefined
    let contributorsString: string | undefined
    let pullRequestsString: string | undefined
    let stargazersString: string | undefined
    let commitsString: string | undefined
    let releasesString: string | undefined

    const tailDate = timespan.fromDateString
    const headDate = timespan.toDateString

    if (config.publishIssues) {
      const issues = await Issues.list(tailDate)
      const reactions =
        config.publishTopLikedIssues > 0
          ? await Reactions.map(issues.map((issue) => issue.number))
          : []
      core.info(`issues: ${JSON.stringify(issues)}`)
      issuesString = Issues.render(issues, reactions, timespan, config)
    }

    if (config.publishPulls) {
      const pullRequests = await PullRequests.list()
      pullRequestsString = PullRequests.render(pullRequests, headDate, tailDate)
    }

    if (config.publishCommits || config.publishCommits) {
      const commits = await Commits.list(tailDate)
      if (config.publishCommits) {
        commitsString = Commits.render(commits, headDate, tailDate)
      }
      if (config.publishContributors) {
        contributorsString = Commits.renderContributors(
          commits,
          headDate,
          tailDate,
        )
      }
    }

    if (config.publishStargazers) {
      const stargazers = await Stargazers.list()
      stargazersString = Stargazers.render(stargazers, headDate, tailDate)
    }

    if (config.publishReleases) {
      const releases = await Releases.list()
      releasesString = Releases.render(releases, headDate, tailDate)
    }

    const arr = [
      issuesString,
      pullRequestsString,
      commitsString,
      contributorsString,
      stargazersString,
      releasesString,
    ]

    arr.forEach((item) => {
      if (item) {
        body += '\n - - - \n'
        body += item
      }
    })

    body += renderFooter(timespan, config)
    body +=
      '> Your [**Weekly Digest**](https://github.com/apps/weekly-digest) bot. :calendar:\n'
    return body
  }

  function renderHeader(timespan: Timespan, config: Config) {
    return Util.render(config.templateHeader, timespan)
  }

  function renderFooter(timespan: Timespan, config: Config) {
    return Util.render(config.templateFooter, timespan)
  }
}
