export namespace Templates {
  export const title = 'Weekly Digest ({{ fromDate }} - {{ toDate }})'
  export const header = `Here's the **Weekly Digest** for [*{{ owner }}/ {{ repo }}*](https://github.com/{{ owner }}/{{ repo }}):\n`
  export const footer =
    '\n - - - \n' +
    '\n' +
    `That's all for last week, please <kbd>:eyes: **Watch**</kbd> and <kbd>:star: **Star**</kbd> the repository [*{{ owner }}/{{ repo }}*](https://github.com/{{ owner }}/{{ repo }}) to receive next weekly updates. :smiley:\n\n` +
    `*You can also [view all Weekly Digests by clicking here](https://github.com/{{ owner }}/{{ repo }}/issues?q=is:open+is:issue+label:weekly-digest).* \n\n`

  // ISSUES
  // ------
  export const issuesTitle = '# ISSUES'

  export const issuesSummary = `
  <% if (issues.length === 0) { %>
    Last week, no issues were created.
  <% } else if (issues.length === 1) { %>
    Last week 1 issue was created.
  <% } else { %>
    Last week <%= issues.length %> issues were created.
  <% }  %>
`

  export const issuesStatistics = `
  <% if (issues.length === 1 && openIssues.length === 1) { %>
        It is still open.
  <% } else if (issues.length === openIssues.length && openIssues.length > 1) { %>
        They are still open.
  <% } else if (issues.length === 1 && closedIssues.length === 1) { %>
        It is closed now.
  <% } else if (issues.length === closedIssues.length && closedIssues.length > 1) { %>
        They are all have been closed.
  <% } else if (issues.length > 0) { %>
        Of these,

        <% if (closedIssues.length > 0) { %>
          <% if (closedIssues.length === 1) { %>
            <%= closedIssues.length %> issue has been closed
          <% } else { %>
            <%= closedIssues.length %> issues have been closed
          <% } %>

          <% if (openIssues.length > 0) { %>
            and
          <% } %>
        <% } %>

        <% if (openIssues.length > 0) { %>
          <% if (openIssues.length === 1) { %>
            <%= openIssues.length %> issue is still open
          <% } else { %>
            <%= openIssues.length %> issues are still open
          <% } %>
        <% } %>

        .

  <% } %>
  `

  export const openIssuesTitle = '## OPEN ISSUES'
  export const openIssuesItem = `:green_heart: #<%= issue.number %> <%= issueLink %> by <%= userLink%>`
  export const closedIssuesTitle = '## CLOSED ISSUES'
  export const closedIssuesItem = `:heart: #<%= issue.number %> <%= issueLink %> by <%= userLink%>`

  export const likedIssuesTitle = `
    <% if (likedIssues.length > 1) { %>
      ## TOP <%= likedIssues.length %> LIKED ISSUES
    <% } else { %>
      ## MOST LIKED ISSUE
    <% } %>
  `

  export const likedIssuesReaction = `
    <% var result = [] %>
    <% if (reactions['+1'] > 0) { %>
      <% result.push(':+1: x' + reactions['+1'])  %>
    <% } if(reactions.laugh > 0) { %>
      <% result.push(':smile: x' + reactions.laugh)  %>
    <% } if(reactions.hooray > 0) { %>
      <% result.push(':tada: x' + reactions.hooray)  %>
    <% } if(reactions.heart > 0) { %>
      <% result.push(':heart: x' + reactions.heart)  %>
    <% } if(reactions.rocket > 0) { %>
      <% result.push(':rocket: x' + reactions.rocket)  %>
    <% }%>
    <%= result.join(', ') %>
  `

  export const likedIssuesItem = `:+1: #<%= issue.number %> <%= issueLink %> by <%= userLink%>, received <%= reactions %>.`

  export const hotIssuesTitle = `
    <% if (hotIssues.length > 1) { %>
      ## TOP <%= hotIssues.length %> HOT ISSUES
    <% } else { %>
      ## MOST HOTT ISSUE
    <% } %>
  `
  export const hotIssuesItem = `:speaker: #<%= issue.number %> <%= issueLink %> by <%= userLink%>, received <%= issue.comments %> comments.`

  // PULL REQUESTS
  // -------------
  export const pullRequestsTitle = '# PULL REQUESTS'
  export const pullRequestsSummary = `
    <% if (pullRequests.length === 0) { %>
      Last week, no pull requests were created, updated or merged.
    <% } else if (pullRequests.length === 1) { %>
      Last week 1 pull request was created, updated or merged.
    <% } else { %>
      Last week <%= pullRequests.length %> pull requests were created, updated or merged.
    <% }  %>
`
  export const openPullRequestsTitle = `## OPEN PULL REQUEST`
  export const openPullRequestsSummary = `
    <% if (openPullRequests.length === 1) { %>
      Last week, 1 pull request was opened.
    <% } else { %>
      Last week, <%= openPullRequests.length %> pull requests were opened.
    <% }  %>
  `
  export const openPullRequestsItem = `:green_heart: #<%= pullRequest.number %> <%= pullRequestLink %> by <%= userLink%>`

  export const updatedPullRequestsTitle = `## UPDATED PULL REQUEST`
  export const updatedPullRequestsSummary = `
    <% if (updatedPullRequests.length === 1) { %>
      Last week, 1 pull request was updated.
    <% } else { %>
      Last week, <%= updatedPullRequests.length %> pull requests were updated.
    <% }  %>
  `
  export const updatedPullRequestsItem = `:yellow_heart: #<%= pullRequest.number %> <%= pullRequestLink %> by <%= userLink%>`

  export const mergedPullRequestsTitle = `## MERGED PULL REQUEST`
  export const mergedPullRequestsSummary = `
    <% if (mergedPullRequests.length === 1) { %>
      Last week, 1 pull request was merged.
    <% } else { %>
      Last week, <%= mergedPullRequests.length %> pull requests were merged.
    <% }  %>
  `
  export const mergedPullRequestsItem = `:purple_heart: #<%= pullRequest.number %> <%= pullRequestLink %> by <%= userLink%>`

  // COMMITS
  // -------
  export const commitsTitle = `# COMMITS`
  export const commitsSummary = `
    <% if (commits.length === 0) { %>
      Last week there were no commits.
    <% } else if (commits.length === 1) { %>
      Last week there was 1 commit.
    <% } else { %>
      Last week there were  <%= commits.length %> commits.
    <% }  %>
  `
  export const commitsItem = `:hammer_and_wrench: <%= commitLink %> by <%= userLink%>`

  // CONTRIBUTORS
  // ------------
  export const contributorsTitle = `# CONTRIBUTORS`
  export const contributorsSummary = `
    <% if (contributors.length === 0) { %>
      Last week there were no contributors.
    <% } else if (contributors.length === 1) { %>
      Last week there was 1 contributor.
    <% } else { %>
      Last week there were  <%= contributors.length %> contributors.
    <% }  %>
  `
  export const contributorsItem = `:bust_in_silhouette: <%= userLink%>`

  // STARGAZERS
  // ----------

  // RELEASES
  // --------
}
