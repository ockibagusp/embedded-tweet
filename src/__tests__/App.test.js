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

describe('App js: init', () => {
  assert.exists(App)

  it('init', () => {
    assert.isEmpty(embeddedTweet.element.value)
    assert.equal(embeddedTweet.element.focus(), undefined)

    // assert.isEmpty(results.element.value)
    assert.isUndefined(btnReset.attributes().disabled)
    assert.equal(btnCopy.attributes().disabled, '')
    assert.equal(btnTweet.attributes().disabled, '')
  })
})