/** @module semantic-release-gh-pages-plugin */

import { publish as ghpagePublish, clean } from 'gh-pages'
import execa from 'execa'
import { IPushOpts, TAnyMap } from './interface'

/**
 * @private
 */
export const OK = { status: 'OK' }

/**
 * @private
 */
export const pullTags = (opts: IPushOpts): Promise<any> => {
  const repo = '' + opts.repo
  const execaOpts = {
    env: opts.env,
    cwd: opts.cwd
  }

  return execa('git', ['pull', '--tags', '--force', repo], execaOpts)
}

export const fetchBranch = (opts: IPushOpts): Promise<any> => {
  const repo = '' + opts.repo
  const branch = opts.branch
  const execaOpts = {
    env: opts.env,
    cwd: opts.cwd
  }

  return execa('git', ['fetch', 'origin', branch, repo], execaOpts)
}

/**
 * @private
 */
export const pushPages = (opts: IPushOpts) => new Promise((resolve, reject) => {
  const { src, logger } = opts
  const ghpagesOpts: TAnyMap = {
    repo: opts.repo,
    branch: opts.branch,
    dest: opts.dst,
    message: opts.message
  }

  ghpagePublish(src, ghpagesOpts, (err?: any) => {
    if (err) {
      logger.error('Publish docs failure', err)
      reject(err)

    } else {
      logger.log(`Docs published successfully, branch=${ghpagesOpts.branch}, src=${src}, dst=${ghpagesOpts.dest}`)
      resolve(OK)
    }
  })
})

/**
 * @private
 */
export const publish = (opts: IPushOpts) => pullTags(opts)
  .then(() => fetchBranch(opts))
  .then(() => clean())
  .then(() => pushPages(opts))
