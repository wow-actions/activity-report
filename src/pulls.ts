import moment from 'moment'
import { context } from '@actions/github'
import { Util } from './util'
import { octokit } from './octokit'
import { Await, Config, Timespan } from './types'

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

  const prLink = (pr: PullRequestList[0]) =>
    `[${pr.title.replace(/\n/g, ' ')}](${pr.html_url})`

  const userLink = (pr: PullRequestList[0]) =>
    `[${pr.user!.login}](${pr.user!.html_url})`

  export function render(
    pullRequestList: PullRequestList = [],
    timespan: Timespan,
    config: Config,
  ) {
    const toDate = timespan.toDateString
    const fromDate = timespan.fromDateString

    const pullRequests = pullRequestList.filter(
      (pr) =>
        (pr.state === 'open' &&
          pr.merged_at == null &&
          moment(pr.created_at).isBetween(fromDate, toDate) &&
          moment(pr.created_at).isSame(pr.updated_at)) ||
        (pr.state === 'open' &&
          pr.merged_at == null &&
          moment(pr.updated_at).isBetween(fromDate, toDate)) ||
        (moment(pr.closed_at).isBetween(fromDate, toDate) &&
          pr.state === 'closed'),
    )

    const result: string[] = []
    result.push(renderTitle(timespan, config))
    result.push(renderSummary(timespan, config, pullRequests))

    if (pullRequests.length > 0) {
      const opens = pullRequests.filter(
        (pr) =>
          moment(pr.created_at).isBetween(fromDate, toDate) &&
          moment(pr.created_at).isSame(pr.updated_at) &&
          pr.merged_at == null,
      )

      const updates = pullRequests.filter(
        (pr) =>
          moment(pr.updated_at).isBetween(fromDate, toDate) &&
          !moment(pr.updated_at).isSame(pr.created_at) &&
          pr.merged_at == null,
      )

      const merges = pullRequests.filter(
        (pr) =>
          pr.merged_at != null &&
          moment(pr.merged_at).isBetween(fromDate, toDate),
      )

      if (opens.length > 0) {
        result.push(
          renderOpenPullRequestsTitle(timespan, config, opens, pullRequests),
          renderOpenPullRequestssSummary(timespan, config, opens, pullRequests),
          opens
            .map((pullRequest) =>
              renderOpenPullRequestsItem(
                timespan,
                config,
                pullRequest,
                opens,
                pullRequests,
              ),
            )
            .join('\n'),
        )
      }

      if (updates.length > 0) {
        result.push(
          renderUpdatedPullRequestsTitle(
            timespan,
            config,
            updates,
            pullRequests,
          ),
          renderUpdatedPullRequestssSummary(
            timespan,
            config,
            updates,
            pullRequests,
          ),
          updates
            .map((pullRequest) =>
              renderUpdatedPullRequestsItem(
                timespan,
                config,
                pullRequest,
                updates,
                pullRequests,
              ),
            )
            .join('\n'),
        )
      }

      if (merges.length > 0) {
        result.push(
          renderMergedPullRequestsTitle(timespan, config, merges, pullRequests),
          renderMergedPullRequestssSummary(
            timespan,
            config,
            merges,
            pullRequests,
          ),
          merges
            .map((pullRequest) =>
              renderMergedPullRequestsItem(
                timespan,
                config,
                pullRequest,
                merges,
                pullRequests,
              ),
            )
            .join('\n'),
        )
      }
    }

    return result.join('\n')
  }

  function renderTitle(timespan: Timespan, config: Config) {
    return Util.render(config.templatePullRequestsTitle, timespan, {}, true)
  }

  function renderSummary(
    timespan: Timespan,
    config: Config,
    pullRequests: PullRequestList,
  ) {
    return Util.render(
      config.templatePullRequestsSummary,
      timespan,
      {
        pullRequests,
      },
      true,
    )
  }

  function renderOpenPullRequestsTitle(
    timespan: Timespan,
    config: Config,
    openPullRequests: PullRequestList,
    pullRequests: PullRequestList,
  ) {
    return Util.render(
      config.templateOpenPullRequestsTitle,
      timespan,
      {
        openPullRequests,
        pullRequests,
      },
      true,
    )
  }

  function renderOpenPullRequestsItem(
    timespan: Timespan,
    config: Config,
    pullRequest: PullRequestList[0],
    openPullRequests: PullRequestList,
    pullRequests: PullRequestList,
  ) {
    return Util.render(
      config.templateOpenPullRequestsItem,
      timespan,
      {
        pullRequest,
        openPullRequests,
        pullRequests,
        pullRequestLink: prLink(pullRequest),
        userLink: userLink(pullRequest),
      },
      true,
    )
  }

  function renderOpenPullRequestssSummary(
    timespan: Timespan,
    config: Config,
    openPullRequests: PullRequestList,
    pullRequests: PullRequestList,
  ) {
    return Util.render(
      config.templateOpenPullRequestsSummary,
      timespan,
      {
        pullRequests,
        openPullRequests,
      },
      true,
    )
  }

  function renderUpdatedPullRequestsTitle(
    timespan: Timespan,
    config: Config,
    updatedPullRequests: PullRequestList,
    pullRequests: PullRequestList,
  ) {
    return Util.render(
      config.templateUpdatedPullRequestsTitle,
      timespan,
      {
        updatedPullRequests,
        pullRequests,
      },
      true,
    )
  }

  function renderUpdatedPullRequestsItem(
    timespan: Timespan,
    config: Config,
    pullRequest: PullRequestList[0],
    updatedPullRequests: PullRequestList,
    pullRequests: PullRequestList,
  ) {
    return Util.render(
      config.templateUpdatedPullRequestsItem,
      timespan,
      {
        pullRequest,
        updatedPullRequests,
        pullRequests,
        pullRequestLink: prLink(pullRequest),
        userLink: userLink(pullRequest),
      },
      true,
    )
  }

  function renderUpdatedPullRequestssSummary(
    timespan: Timespan,
    config: Config,
    updatedPullRequests: PullRequestList,
    pullRequests: PullRequestList,
  ) {
    return Util.render(
      config.templateUpdatedPullRequestsSummary,
      timespan,
      {
        pullRequests,
        updatedPullRequests,
      },
      true,
    )
  }

  function renderMergedPullRequestsTitle(
    timespan: Timespan,
    config: Config,
    mergedPullRequests: PullRequestList,
    pullRequests: PullRequestList,
  ) {
    return Util.render(
      config.templateMergedPullRequestsTitle,
      timespan,
      {
        mergedPullRequests,
        pullRequests,
      },
      true,
    )
  }

  function renderMergedPullRequestsItem(
    timespan: Timespan,
    config: Config,
    pullRequest: PullRequestList[0],
    mergedPullRequests: PullRequestList,
    pullRequests: PullRequestList,
  ) {
    return Util.render(
      config.templateMergedPullRequestsItem,
      timespan,
      {
        pullRequest,
        mergedPullRequests,
        pullRequests,
        pullRequestLink: prLink(pullRequest),
        userLink: userLink(pullRequest),
      },
      true,
    )
  }

  function renderMergedPullRequestssSummary(
    timespan: Timespan,
    config: Config,
    mergedPullRequests: PullRequestList,
    pullRequests: PullRequestList,
  ) {
    return Util.render(
      config.templateMergedPullRequestsSummary,
      timespan,
      {
        pullRequests,
        mergedPullRequests,
      },
      true,
    )
  }
}
