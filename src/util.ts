import moment from 'moment'
import * as core from '@actions/core'

export namespace Util {
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

  export function getInputs() {
    const days = parseInt(core.getInput('prs'), 10) || 7
    return {
      days: Number.isFinite(days) ? days : 7,
      pulls: core.getInput('pulls') !== 'false',
      issues: core.getInput('issues') !== 'false',
      topHotIssues: numberInput('top_hot_issues', 3),
      topLikedIssues: numberInput('top_liked_issues', 3),
      commits: core.getInput('commits') !== 'false',
      releases: core.getInput('releases') !== 'false',
      stargazers: core.getInput('stargazers') !== 'false',
      contributors: core.getInput('contributors') !== 'false',
    }
  }
}
