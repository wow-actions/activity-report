import * as core from '@actions/core'
import { Util } from './util'
import { Issues } from './issues'
import { Renderer } from './render'

async function run() {
  const config = Util.getInputs()
  const timespan = Util.getTimespan()

  core.info(`Report from ${timespan.fromDate} to ${timespan.toDate}`)

  const title = Renderer.renderTitle(timespan, config)
  const body = await Renderer.renderBody(timespan, config)
  await Issues.create(title, body, config.addLabels)
}

run()
