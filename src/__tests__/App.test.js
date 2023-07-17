import { describe, it, assert, expect, vi } from 'vitest'

import { mount, flushPromises } from '@vue/test-utils'
import App from '../App.vue'

const wrapper = mount(App, {
	props: { } 
})

// textarea: embedded tweet
const embeddedTweet = wrapper.get('[data-test="embedded-tweet"]')

// button: btnReset, btnCopy dan btnTweet
const btnReset = wrapper.get('[data-test="btn-reset"]') 
const btnCopy = wrapper.get('[data-test="btn-copy"]')
const btnTweet = wrapper.get('[data-test="btn-tweet"]')

// strong: '*Tweet ini tidak ada hasil'
const strNoResult = wrapper.find('[data-test="str-no-result"]')

/**
  * Di Internet, alamat bernama embedded-tweet adalah 'http://localhost:3000',
  *   'https://ockibagusp.github.io/embedded-tweet/' atau lainnya
  * 
  * 1. Tautan (Twitter.com) Tweet baru: salin tautan ke Tweet
  *   - masukan tautan ke Menyematkan (tertanam) Video Tweet. 
  *   - (1) misalnya: https://twitter.com/ockibagusp/status/1592924571732414465?s=20&t=bgO6hwTfDckbtQibxDJZPQ
  *     string ke array
  *     ok: 
  * 
  *   - (2) misalnya: Bang Messi "KW": (2)\n\nhttps://twitter.com/ockibagusp/status/1667598173530095616?s=20
  *     string ke array
  *     ok: 
  * 
  *   - (3) misalnya: -
  *     string ke array
  *     no:
  * 
  *   - The includes() Method https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_includes
  * 3.
  */

/**
 * TDD
 * Embedded Tweet
 * 
 * 1. App js: init [x]
 * 2. App js: embedded tweet all [ ]
 *  - success
 *  - failure
 * 3. App js: reset embedded tweet [ ]
 */
describe('App js: init', () => {
  assert.exists(App)

  it('init', () => {
    assert.isEmpty(embeddedTweet.element.value)
    assert.equal(embeddedTweet.element.focus(), undefined)
    assert.ifError(strNoResult.exists())

    assert.isUndefined(btnReset.attributes().disabled)
    assert.equal(btnCopy.attributes().disabled, '')
    assert.equal(btnTweet.attributes().disabled, '')
  })
})

describe('App js: embedded tweet all', () => {
  it('embedded tweet: success', async() => {
    // test cases
    const testCases = [
      {
        name: 'embedded tweet success: 1',
        embeddedTweet: 'Fedora 37! 👏 (2)\n\nhttps://twitter.com/ockibagusp/status/1592924571732414465?s=20&t=bgO6hwTfDckbtQibxDJZPQ',
        results: 'Fedora 37! 👏 (2)\n\nhttps://twitter.com/ockibagusp/status/1592924571732414465/video/1',
        tweetIs: 'Tweet is: + 196'
      },
      {
        name: 'embedded tweet success: 2',
        embeddedTweet: 'Bang Messi "KW": (2)\n\nhttps://twitter.com/ockibagusp/status/1667598173530095616?s=20',
        results: 'Bang Messi "KW": (2)\n\nhttps://twitter.com/ockibagusp/status/1667598173530095616/video/1',
        tweetIs: 'Tweet is: + 193'
      },
      {
        name: 'embedded tweet success: 3',
        embeddedTweet: 'Cara Menerima THR yang Benar [Meme] (2)\n\nSrc. (YouTube)\n\nhttps://twitter.com/ockibagusp/status/1647863715159760896',
        results: 'Cara Menerima THR yang Benar [Meme] (2)\n\nSrc. (YouTube)\n\nhttps://twitter.com/ockibagusp/status/1647863715159760896/video/1',
        tweetIs: 'Tweet is: + 158'
      },
      {
        name: 'embedded tweet success: 4',
        embeddedTweet: 'https://twitter.com/NRBTweetz/status/1640326522916728834?s=20',
        results: 'https://twitter.com/NRBTweetz/status/1640326522916728834/video/1',
        tweetIs: 'Tweet is: + 216'
      }
    ]

    for (let test of testCases) {
      console.debug('name success:', test.name)

      await embeddedTweet.setValue(test.embeddedTweet)
      await embeddedTweet.trigger('change')

      assert.equal(embeddedTweet.element.value, test.results)
      assert.equal(btnTweet.text(), test.tweetIs)
    }
  })

  it('embedded tweet: failure', async() => {
    // test cases
    const testCases = [
      {
        name: 'embedded tweet failure: 1',
        embeddedTweet: 'Test Failure 1\n\n-',
        results: 'Test Failure 1\n\n-',
        tweetIs: 'Tweet is: + 263'
      },
      {
        name: 'embedded tweet failure: 2',
        embeddedTweet: 'Test Failure 2\n\nhttps://twitter.com/test/status/',
        results: 'Test Failure 2\n\nhttps://twitter.com/test/status/',
        tweetIs: 'Tweet is: + 232'
      },
      {
        name: 'embedded tweet failure: 3',
        embeddedTweet: 'Test Failure 3\n\nhttps://twitter.com//status/1592924571732414465?s=20',
        results: 'Test Failure 3\n\nhttps://twitter.com//status/1592924571732414465?s=20',
        tweetIs: 'Tweet is: + 212'
      }
    ]

    for (let test of testCases) {
      console.debug('name failure:', test.name)

      await embeddedTweet.setValue(test.embeddedTweet)
      await embeddedTweet.trigger('change')

      assert.equal(embeddedTweet.element.value, test.results)
      assert.equal(btnTweet.text(), test.tweetIs)
    }
  })
})

// describe('App js: reset embedded tweet', () => {
//   it('reset embedded tweet', async() => {
//   })
// })

// describe('App js: button reset', () => {
//   it('button reset', async() => {
//     // 1. textarea: embeddedTweet = '-'
//     // 2. textarea: hasil = '*Tweet ini tidak ada hasil'
//     await embeddedTweet.setValue('-')

//     assert.equal(embeddedTweet.element.value, '-')
//     assert.equal(strNoResult.text(), '*Tweet ini tidak ada hasil')
//     await btnReset.trigger('click')

//     assert.equal(embeddedTweet.element.value, '')
//     assert.equal(btnCopy.attributes().disabled, '')
//     assert.equal(btnTweet.attributes().disabled, '')
//   })
// })