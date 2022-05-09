const core = require('@actions/core')
const github = require('@actions/github')
const axios = require('axios')

try {
  const changedComment = github.context.payload.comment.body
  const prBody = github.context.payload.issue.body
  const jiraToken = core.getInput('jira-token')
  const baseURL = core.getInput('jira-url')
  const email = core.getInput('jira-email')
  const vercelRegExp = changedComment.match(/review.+(https?\S+\.vercel\.app)/)
  const jiraRegExp = prBody.match(/(https?:\/\/freewheelin\.atlassian\.net\/browse\/(\S+\-[0-9]+))/)

  if (vercelRegExp && jiraRegExp) {
    const [, vercelUrl] = vercelRegExp
    const [, jiraUrl, issueKey] = jiraRegExp

    if (vercelUrl && jiraUrl) {
      const auth = `Basic ${Buffer.from(`${email}:${jiraToken}`).toString('base64')}`

      const body = `{
        "body": {
          "type": "doc",
          "version": 1,
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "text": "preview url : ${vercelUrl}",
                  "type": "text"
                }
              ]
            }
          ]
        }
      }`

      const action = axios.create({
        baseURL,
        headers: {
          Authorization: auth,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      action.post(`/issue/${issueKey}/comment`, body)
    }
  }
} catch (error) {
  core.setFailed(error.message)
}
