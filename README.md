<h1 align="center">Activity Report</h1>

<p align="center">Generates a periodic automated summary of activities and happening on your Github repository</p>

<p align="center">
<a href="https://github.com/wow-actions/activity-report/actions/workflows/test.yml"><img alt="build" src="https://img.shields.io/github/actions/workflow/status/wow-actions/activity-report/test.yml?branch=master&logo=github&style=flat-square"></a>
<a href="/LICENSE"><img src="https://img.shields.io/badge/license-MIT_License-green.svg?style=flat-square" alt="MIT License"></a>
<a href="https://www.typescriptlang.org"><img alt="Language" src="https://img.shields.io/badge/language-TypeScript-blue.svg?style=flat-square"></a>
<a href="https://github.com/wow-actions/activity-report/pulls"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square"></a>
<a href="https://lgtm.com/projects/g/wow-actions/activity-report/context:javascript"><img alt="Language grade: JavaScript" src="https://img.shields.io/lgtm/grade/javascript/g/wow-actions/activity-report.svg?logo=lgtm&style=flat-square"></a>
</p>

On running the action, it curates together the following data and publishes it as an issue:

- Issues
  - Open Issues
  - Closed Issues
  - Hot Issue
  - Liked Issue
- Pull requests
  - Opened Pull Requests
  - Updated Pull Requests
  - Merged Pull Requests
- Commits made in the master branch
- Contributors
- Stargazers
- Releases

## Usage

Create a `.github/workflows/weekly-report.yml` file in the repository you want to install this action:

```yml
name: Weekly Report
on:
  schedule:
    - cron: '0 6 * * 0' # At 06:00 on Sunday
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: wow-actions/activity-report@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**It can only run on a `schedule` event.** This schedule uses a cron notation for fine-grained configuration. You can use the following cron notations. Also you can goto [https://crontab.guru](https://crontab.guru/) to design your cron notation which translating the cron schedule into human-readable format.

- Daily - `0 8 * * *` At 08:00.
- Weekly - `0 8 * * 0` At 08:00 on Sunday.
- Monthly - `0 8 1 * *` At 08:00 on day-of-month 1.
- Quarterly - `0 8 1 1/3 *` At 08:00 on day-of-month 1 in every 3rd month from January through December.
- Half-Yearly - `0 8 1 1/6 *` At 08:00 on day-of-month 1 in every 6th month from January through December.
- Yearly - `0 8 1 1 *` At 08:00 on day-of-month 1 in January.

We will auto detect your report type (`Daily`, `Weekly`, `Monthly`, `Quarterly`, `Half-Yearly` or `Yearly`) by the cron notation and replace the timing keywords in the issue(title and body). e.g. `"Weekly Report (23 March, 2021 - 30 March, 2021)"`. Other undetectable crons will fallback to use the inexact timing keywords. e.g. `"Activity Report (25 March, 2021 - 30 March, 2021)"`.

## Inputs

Various inputs are defined to let you configure the action:

> Note: [Workflow command and parameter names are not case-sensitive](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-commands-for-github-actions#about-workflow-commands).

| Name | Description | Default |
| --- | --- | --- |
| `GITHUB_TOKEN` | The GitHub token for authentication | N/A |
| `publish_issues` | Should publish issues or not | `true` |
| `publish_top_liked_issues` | Should publish top liked issues with most positive reactions or not, or the count of top liked issues to publish | `3` |
| `publish_top_hot_issues` | Should publish top hot issues with most comments or not, or the count of top hot issues to publish | `3` |
| `publish_pull_requests` | Should publish pull requests or not | `true` |
| `publish_contributors` | Should publish contributors or not | `true` |
| `publish_stargazers` | Should publish stargazers or not | `true` |
| `publish_commits` | Should publish commits or not | `true` |
| `publish_releases` | Should publish releases or not | `true` |
| `add_labels` | Comma separated labels to be add to the issue create by this action <br> By default, the action will add a label in the form `"{{ type }}-report"`, such as `weekly-report`, to the issue |  |

### Custom template the render the issue

Using these inputs of template to custom your report. The default templates can be found [here](/src/templates.ts). Follow the [`lodash.template`](https://www.npmjs.com/package/lodash.template) [documentation](https://lodash.com/docs#template).

- template_title
- template_header
- template_footer
- template_issues_title
- template_issues_summary
- template_issues_summary
- template_issues_statistics
- template_open_issues_title
- template_open_issues_item
- template_open_issues_item
- template_closed_issues_title
- template_closed_issues_item
- template_liked_issues_title
- template_liked_issues_item
- template_liked_issues_item
- template_liked_issues_reaction
- template_hot_issues_title
- template_hot_issues_item
- template_pull_requests_title
- template_pull_requests_summary
- template_open_pull_requests_title
- template_open_pull_requests_summary
- template_open_pull_requests_item
- template_updated_pull_requests_title
- template_updated_pull_requests_summary
- template_updated_pull_requests_item
- template_merged_pull_requests_title
- template_merged_pull_requests_summary
- template_merged_pull_requests_item
- template_commits_title
- template_commits_summary
- template_commits_item
- template_contributors_title
- template_contributors_summary
- template_contributors_item
- template_stargazers_title
- template_stargazers_summary
- template_stargazers_item
- template_releases_title
- template_releases_summary
- template_releases_item

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
