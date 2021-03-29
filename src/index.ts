import * as core from '@actions/core'
import { context } from '@actions/github'
import { Util } from './util'
import { Issues } from './issues'
import { Renderer } from './render'

async function run() {
  if (context.eventName === 'schedule') {
    const config = Util.getInputs()
    const timespan = Util.getTimespan()

    core.info(`Report from ${timespan.fromDate} to ${timespan.toDate}`)

    const title = Renderer.renderTitle(timespan, config)
    const body = await Renderer.renderBody(timespan, config)
    await Issues.create(title, body, config.addLabels)
  }
}

run()
