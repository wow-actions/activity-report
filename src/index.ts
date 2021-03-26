import * as core from '@actions/core'
import { context } from '@actions/github'
import { Util } from './util'
import { Config } from './types'
import { Issues } from './issues'
import { Commits } from './commits'
import { Releases } from './releases'
import { Stargazers } from './stargazers'
import { PullRequests } from './pulls'
import { Reactions } from './reactions'

async function checkDuplicates(headDate: string) {
  const author = 'app/weekly-digest'
  const type = 'issues'
  const date = Util.getDayBeforeDate(headDate).substr(0, 19)
  const issues = await Issues.search({
    date,
    author,
    type,
  })
  const total = issues.data.total_count
  return {
    duplicated: total >= 1,
    url: total >= 1 ? issues.data.items[0].html_url : undefined,
  }
}

async function markdownBody(
  headDate: string,
  tailDate: string,
  config: Config,
) {
  const { owner, repo } = context.repo
  let body = `Here's the **Weekly Digest** for [*${owner}/${repo}*](https://github.com/${owner}/${repo}):\n`

  let issuesString: string | undefined
  let contributorsString: string | undefined
  let pullRequestsString: string | undefined
  let stargazersString: string | undefined
  let commitsString: string | undefined
  let releasesString: string | undefined

  if (config.issues) {
    const issues = await Issues.list(tailDate)
    const reactions =
      config.topLikedIssues > 0
        ? await Reactions.map(issues.map((issue) => issue.number))
        : []
    issuesString = Issues.render(issues, reactions, headDate, tailDate, config)
  }

  if (config.pulls) {
    const pullRequests = await PullRequests.list()
    pullRequestsString = PullRequests.render(pullRequests, headDate, tailDate)
  }

  if (config.commits || config.commits) {
    const commits = await Commits.list(tailDate)
    if (config.commits) {
      commitsString = Commits.render(commits, headDate, tailDate)
    }
    if (config.contributors) {
      contributorsString = Commits.renderContributors(
        commits,
        headDate,
        tailDate,
      )
    }
  }

  if (config.stargazers) {
    const stargazers = await Stargazers.list()
    stargazersString = Stargazers.render(stargazers, headDate, tailDate)
  }

  if (config.releases) {
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

  body += '\n - - - \n'
  body += '\n'
  body += `That's all for last week, please <kbd>:eyes: **Watch**</kbd> and <kbd>:star: **Star**</kbd> the repository [*${owner}/${repo}*](https://github.com/${owner}/${repo}) to receive next weekly updates. :smiley:\n\n`
  body += `*You can also [view all Weekly Digests by clicking here](https://github.com/${owner}/${repo}/issues?q=is:open+is:issue+label:weekly-digest).* \n\n`
  body +=
    '> Your [**Weekly Digest**](https://github.com/apps/weekly-digest) bot. :calendar:\n'
  return body
}

async function run() {
  const config = Util.getInputs()
  const headDate = Util.getDate()
  const tailDate = Util.getDate(config.days)
  const { duplicated, url } = await checkDuplicates(headDate)
  if (duplicated) {
    core.info(`Weekly Digest for this week has already been published: ${url}`)
  }

  core.info(JSON.stringify(context))

  const fromDate = Util.formatDateInTitle(tailDate)
  const toDate = Util.formatDateInTitle(headDate)
  const title = `Weekly Digest (${fromDate} - ${toDate})`
  const body = await markdownBody(headDate, tailDate, config)
  const labels = ['weekly-digest']
  await Issues.create(title, body, labels)
}

run()
