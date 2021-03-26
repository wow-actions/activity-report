export namespace Templates {
  export const title = 'Weekly Digest ({{ fromDate }} - {{ toDate }})'

  export const header = `Here's the **Weekly Digest** for [*{{ owner }}/ {{ repo }}*](https://github.com/{{ owner }}/{{ repo }}):\n`

  export const footer =
    '\n - - - \n' +
    '\n' +
    `That's all for last week, please <kbd>:eyes: **Watch**</kbd> and <kbd>:star: **Star**</kbd> the repository [*{{ owner }}/{{ repo }}*](https://github.com/{{ owner }}/{{ repo }}) to receive next weekly updates. :smiley:\n\n` +
    `*You can also [view all Weekly Digests by clicking here](https://github.com/{{ owner }}/{{ repo }}/issues?q=is:open+is:issue+label:weekly-digest).* \n\n`

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

  const issueLink =
    '#<%= issue.number %> [<%= issue.title %>](<%= issue.html_url %>)'
  const issueUser = '[<%= issue.user.login %>](<%= issue.user.html_url %>)'

  export const openIssuesTitle = '## OPEN ISSUES'
  export const openIssuesItem = `:green_heart: ${issueLink} by ${issueUser}`
  export const closedIssuesTitle = '## CLOSED ISSUES'
  export const closedIssuesItem = `:heart: ${issueLink} by ${issueUser}`

  export const likedIssuesTitle = `
    <% if (likedIssues.length > 1) { %>
      ## TOP <%= likedIssues.length %> MOST LIKED ISSUES
    <% } else { %>
      ## MOST LIKED ISSUE
    <% } %>
  `

  export const likedIssuesReaction = `
    <% var result = [] %>
    <% if (reactions['+1'] > 0) { %>
      <% result.push(':+1: x' + reactions['+1'])  %>
    <% } else if(reactions.laugh > 0) { %>
      <% result.push(':smile: x' + reactions.laugh)  %>
    <% } else if(reactions.hooray > 0) { %>
      <% result.push(':tada: x' + reactions.hooray)  %>
    <% } else if(reactions.heart > 0) { %>
      <% result.push(':heart: x' + reactions.heart)  %>
    <% } else if(reactions.rocket > 0) { %>
      <% result.push(':rocket: x' + reactions.rocket)  %>
    <% }%>
    <%= result.join(', ') %>
  `

  export const likedIssuesItem = `
    <% for (var i = 0, l = likedIssues.length; i < l; i+=1) { %>
      <% var issue = likedIssues[i] %>
      :+1: ${issueLink} by ${issueUser}, received <%= reactions %>.
    <% } %>
  `

  export const hotIssuesTitle = `
    <% if (hotIssues.length > 1) { %>
      ## TOP <%= hotIssues.length %> MOST HOT ISSUES
    <% } else { %>
      ## MOST HOTT ISSUE
    <% } %>
  `
  export const hotIssuesItem = `
    <% for (var i = 0, l = hotIssues.length; i < l; i+=1) { %>
      <% var issue = hotIssues[i] %>
        :speaker: ${issueLink} by ${issueUser}, received <%= issue.comments %> comments.
    <% } %>
  `
}
