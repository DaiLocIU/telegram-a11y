import { config } from '@vue/test-utils'
import { cleanup } from '@testing-library/vue'
import ResizeObserver from 'resize-observer-polyfill'
import { vi, afterEach } from 'vitest'

vi.stubGlobal('ResizeObserver', ResizeObserver)

config.global.stubs = {}


// Automatically unmount all mounted components after each test
afterEach(() => {
  cleanup()
  console.log('Cleanup after test')
  document.body.innerHTML = '' // Optional hard reset
})