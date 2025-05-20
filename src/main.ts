/*
 * This file is part of the "GS Commit Message Checker" Action for Github.
 *
 * Copyright (C) 2019 by Gilbertsoft LLC (gilbertsoft.org)
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * For the full license information, please read the LICENSE file that
 * was distributed with this source code.
 */

/**
 * Imports
 */
import * as core from '@actions/core'
import * as inputHelper from './input-helper'
import * as commitMessageChecker from './commit-message-checker'

const fs = require('fs')

/**
 * Main function
 */
async function run(): Promise<void> {
  try {
    const onePassAllPass = core.getInput('one_pass_all_pass')
    const commitsString = core.getInput('commits')
    let commits
    try {
      commits = JSON.parse(commitsString)
    } catch (je) {
      const data = fs.readFileSync(commitsString, {encoding: 'utf8', flag: 'r'})
      commits = JSON.parse(data)
    }
    const checkerArguments = inputHelper.getInputs()

    const preErrorMsg = core.getInput('pre_error')
    const postErrorMsg = core.getInput('post_error')

    const failed = []

    for (const {commit, sha} of commits) {
      inputHelper.checkArgs(checkerArguments)
      let errMsg = commitMessageChecker.checkCommitMessages(checkerArguments, commit.message)

      if (errMsg) {
        failed.push({sha, message: errMsg})
      }
    }

    if (onePassAllPass === 'true' && commits.length > failed.length) {
      return
    }

    if (failed.length > 0) {
      const summary = inputHelper.genOutput(failed, preErrorMsg, postErrorMsg)
      core.setFailed(summary)
    }

  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

/**
 * Main entry point
 */
run()
