import { getInput } from '@actions/core'
import { getOctokit } from '@actions/github'

const token = getInput('GITHUB_TOKEN', { required: true })

export const octokit = getOctokit(token)
