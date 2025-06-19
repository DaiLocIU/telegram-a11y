import { config } from '@vue/test-utils'
import ResizeObserver from 'resize-observer-polyfill'
import { vi } from 'vitest'

vi.stubGlobal('ResizeObserver', ResizeObserver)

config.global.stubs = {}
