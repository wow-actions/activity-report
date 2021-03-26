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

  export function getInputs() {
    const days = parseInt(core.getInput('prs'), 10) || 7
    return {
      days: Number.isFinite(days) ? days : 7,
      pulls: core.getInput('pulls') !== 'false',
      issues: core.getInput('issues') !== 'false',
      commits: core.getInput('commits') !== 'false',
      releases: core.getInput('releases') !== 'false',
      stargazers: core.getInput('stargazers') !== 'false',
      contributors: core.getInput('contributors') !== 'false',
    }
  }
}
