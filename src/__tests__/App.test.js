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
 * TDD
 * Embedded Tweet
 * ✅ ❌
 * 
 * 1. App js: init ✅
 * 2. App js: embedded tweet all
 *  - success
 *  - failure
 * 3. App js: reset embedded tweet
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
  it('embedded tweet: success', () => {
    
  })

  it('embedded tweet: failure', () => {
  })
})

describe('App js: reset embedded tweet', () => {
  it('reset embedded tweet', () => {
  })
})

describe('App js: button reset', () => {
  it('button reset', async() => {
    // 1. textarea: embeddedTweet = '-'
    // 2. textarea: hasil = '*Tweet ini tidak ada hasil'
    await embeddedTweet.setValue('-')

    assert.equal(embeddedTweet.element.value, '-')
    assert.equal(strNoResult.text(), '*Tweet ini tidak ada hasil')
    await btnReset.trigger('click')

    assert.equal(embeddedTweet.element.value, '')
    assert.equal(btnCopy.attributes().disabled, '')
    assert.equal(btnTweet.attributes().disabled, '')
  })
})