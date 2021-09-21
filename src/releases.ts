import moment from 'moment'
import { context } from '@actions/github'
import { Util } from './util'
import { octokit } from './octokit'
import { Await, Config, Timespan } from './types'

export namespace Releases {
  export async function list() {
    const releases = await octokit.paginate(octokit.rest.repos.listReleases, {
      ...context.repo,
      per_page: 100,
    })
    return releases
  }

  type ReleaseList = Await<ReturnType<typeof list>>

  export function render(
    releaseList: ReleaseList = [],
    timespan: Timespan,
    config: Config,
  ) {
    const releases = releaseList.filter((item) =>
      moment(item.published_at).isBetween(timespan.fromDate, timespan.toDate),
    )

    const result: string[] = []
    result.push(
      renderTitle(timespan, config, releases),
      renderSummary(timespan, config, releases),
      releases
        .map((release) => renderItem(timespan, config, release, releases))
        .join('\n'),
    )

    return result.join('\n')
  }

  function releaseName(release: ReleaseList[0]) {
    let result = release.tag_name.replace(/\n/g, ' ')
    if (release.tag_name !== release.name && release.name) {
      result += ` ${release.name.replace(/\n/g, ' ')}`
    }
    return result
  }

  function renderTitle(
    timespan: Timespan,
    config: Config,
    releases: ReleaseList,
  ) {
    return Util.render(
      config.templateReleasesTitle,
      timespan,
      {
        releases,
      },
      true,
    )
  }

  function renderSummary(
    timespan: Timespan,
    config: Config,
    releases: ReleaseList,
  ) {
    return Util.render(
      config.templateReleasesSummary,
      timespan,
      {
        releases,
      },
      true,
    )
  }

  function renderItem(
    timespan: Timespan,
    config: Config,
    release: ReleaseList[0],
    releases: ReleaseList,
  ) {
    return Util.render(
      config.templateReleasesItem,
      timespan,
      {
        release,
        releases,
        releaseName: releaseName(release),
      },
      true,
    )
  }
}
