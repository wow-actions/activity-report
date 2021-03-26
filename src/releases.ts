import moment from 'moment'
import { context } from '@actions/github'
import { octokit } from './octokit'
import { Await } from './types'

export namespace Releases {
  export async function list() {
    const releases = await octokit.paginate(octokit.repos.listReleases, {
      ...context.repo,
      per_page: 100,
    })
    return releases
  }

  type ReleaseList = Await<ReturnType<typeof list>>

  const name = (item: ReleaseList[0]) =>
    item.tag_name.replace(/\n/g, ' ') +
    (item.name != null ? ` ${item.name.replace(/\n/g, ' ')}` : '')

  export function render(
    releases: ReleaseList = [],
    headDate: string,
    tailDate: string,
  ) {
    let result = '# RELEASES\n'
    const data = releases.filter((item) =>
      moment(item.published_at).isBetween(tailDate, headDate),
    )

    const total = data.length
    if (total === 0) {
      result += 'Last week there were no releases.\n'
    } else {
      if (total === 1) {
        result += `Last week there was ${total} release.\n`
      } else {
        result += `Last week there were ${total} releases.\n`
      }

      data.forEach((item) => {
        result += `:rocket: [${name(item)}](${item.html_url})\n`
      })
    }

    return result
  }
}
