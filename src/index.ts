import * as core from '@actions/core'
import { Util } from './util'
import { Issues } from './issues'
import { Renderer } from './render'

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

async function run() {
  // const { payload, eventName } = context
  // if (eventName === 'schedule' && payload.schedule) {
  // }
  const config = Util.getInputs()
  const timespan = Util.getTimespan()
  const { duplicated, url } = await checkDuplicates(timespan.toDateString)
  if (duplicated) {
    core.info(`Weekly Digest for this week has already been published: ${url}`)
  }

  core.info(
    `Digest from ${timespan.fromDateString} to ${timespan.toDateString}`,
  )

  const title = Renderer.renderTitle(timespan, config)
  const body = await Renderer.renderBody(timespan, config)
  await Issues.create(title, body, config.addLabels)
}

run()
