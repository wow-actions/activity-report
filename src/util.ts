import moment from 'moment'
import cronParse from 'cron-parser'
import compile from 'lodash.template'
import * as core from '@actions/core'
import { context } from '@actions/github'
import { Templates } from './templates'
import { Timespan } from './types'

export namespace Util {
  export function getTimespan(): Timespan {
    const current = moment.utc().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    })

    let fromDateString: string
    const toDateString = current.add(1, 'days').format()

    const cron = context.payload.schedule as string
    if (cron) {
      const interval = cronParse.parseExpression(cron)
      const sub = interval.next().getTime() - new Date().getTime()

      fromDateString = current.subtract(sub, 'milliseconds').format()
    } else {
      fromDateString = current.subtract(7, 'days').format()
    }

    return {
      fromDateString,
      toDateString,
      fromDateObject: moment(fromDateString).toObject(),
      toDateObject: moment(toDateString).toObject(),
    }
  }

  export function getDate(subtract?: number) {
    const current = moment.utc().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    })

    if (subtract) {
      current.subtract(subtract, 'days')
    }

    return current.format()
  }

  export function formatDateInTitle(date: string) {
    const d = moment(date).toObject()
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    return `${d.date} ${monthNames[d.months]}, ${d.years}`
  }

  export const getDayBeforeDate = (date: moment.MomentInput) =>
    moment(date).subtract(1, 'days').format()

  const numberInput = (name: string, defaultValue: number) => {
    const raw = core.getInput(name)
    if (raw === 'true') {
      return defaultValue
    }
    if (raw === 'false') {
      return 0
    }
    const num = parseInt(raw, 10)
    return Number.isFinite(num) ? num : defaultValue
  }

  {
    // {{#switch state}}
    //    {{#case "page1" "page2" break=false}}toolbar{{/case}}
    //    {{#case "page1" }}page1{{/case}}
    //    {{#case "page2" break=true}}page2{{/case}}
    //    {{#case "page3" break=true}}page3{{/case}}
    //    {{#default }}page0{{/default}}
    // {{/switch}}
    //
    // const cache: WeakMap<
    //   any,
    //   {
    //     value: any
    //     break: boolean
    //   }
    // > = new WeakMap()
    // Handlebars.registerHelper('switch', function (value, options) {
    //   cache.set(this, { value, break: false })
    //   const result = options.fn(this)
    //   cache.delete(this)
    //   return result
    // })
    // Handlebars.registerHelper('case', function (...args: any[]) {
    //   const options = args.pop()
    //   const caseValues = args
    //   const bag = cache.get(this)!
    //   if (bag.break || caseValues.indexOf(bag.value) === -1) {
    //     return ''
    //   }
    //   // default break at each case
    //   bag.break = options.hash.break !== false
    //   return options.fn(this)
    // })
    // Handlebars.registerHelper('default', function (options) {
    //   const bag = cache.get(this)!
    //   if (!bag.break) {
    //     return options.fn(this)
    //   }
    // })
    // // moment
    // MomentHandler.registerHelpers(Handlebars)
  }

  export function render(
    template: string,
    timespan?: Timespan,
    data: any = {},
    cleanBreak?: boolean,
  ) {
    const raw = template.trim()
    const erb = raw.indexOf('<%') !== -1

    const compiled = compile(raw, erb ? {} : { interpolate: /\{\{(.+?)\}\}/g })

    const content = compiled({
      ...context.repo,
      ...timespan,
      ...data,
      context,
    }).trim()
    return cleanBreak ? content.replace(/\n/g, ' ') : content
  }

  export function getInputs() {
    const days = parseInt(core.getInput('prs'), 10) || 7
    const input = (name: string, defaultValue: string) =>
      core.getInput(name) || defaultValue

    return {
      days: Number.isFinite(days) ? days : 7,
      publishPulls: core.getInput('publish_pull_requests') !== 'false',
      publishIssues: core.getInput('publish_issues') !== 'false',
      publishTopHotIssues: numberInput('publish_top_hot_issues', 3),
      publishTopLikedIssues: numberInput('publish_top_liked_issues', 3),
      publishCommits: core.getInput('publish_commits') !== 'false',
      publishReleases: core.getInput('publish_releases') !== 'false',
      publishStargazers: core.getInput('publish_stargazers') !== 'false',
      publishContributors: core.getInput('publish_contributors') !== 'false',

      addLabels: core
        .getInput('add_labels')
        .split(/\s?,\s?/)
        .map((label) => label.trim()),

      templateTitle: input('template_title', Templates.title),
      templateHeader: input('template_header', Templates.header),
      templateFooter: input('template_footer', Templates.footer),

      templateIssuesTitle: input(
        'template_issues_title',
        Templates.issuesTitle,
      ),
      templateIssuesSummary: input(
        'template_issues_summary',
        Templates.issuesSummary,
      ),
      templateIssuesStatistics: input(
        'template_issues_statistics',
        Templates.issuesStatistics,
      ),

      templateOpenIssuesTitle: input(
        'template_open_issues_title',
        Templates.openIssuesTitle,
      ),
      templateOpenIssuesItem: input(
        'template_open_issues_item',
        Templates.openIssuesItem,
      ),

      templateClosedIssuesTitle: input(
        'template_closed_issues_title',
        Templates.closedIssuesTitle,
      ),
      templateClosedIssuesItem: input(
        'template_closed_issues_item',
        Templates.closedIssuesItem,
      ),

      templateLikedIssuesTitle: input(
        'template_liked_issues_title',
        Templates.likedIssuesTitle,
      ),
      templateLikedIssuesReaction: input(
        'template_liked_issues_reaction',
        Templates.likedIssuesReaction,
      ),
      templateLikedIssuesItem: input(
        'template_liked_issues_item',
        Templates.likedIssuesItem,
      ),

      templateHotIssuesTitle: input(
        'template_hot_issues_title',
        Templates.hotIssuesTitle,
      ),
      templateHotIssuesItem: input(
        'template_hot_issues_item',
        Templates.hotIssuesItem,
      ),
    }
  }
}
