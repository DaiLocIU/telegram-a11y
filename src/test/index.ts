import { render as _render } from '@testing-library/vue'
import { createVuetify } from "vuetify";
import type { RenderResult, RenderOptions } from '@testing-library/vue'

export { userEvent, page, commands } from '@vitest/browser/context'
export { screen } from '@testing-library/vue'

export function render<C> (
  component: C,
  options?: RenderOptions<C> | null,
): RenderResult {
  const vuetify = createVuetify()

  const defaultOptions = {
    global: {
      stubs: {
        transition: false,
        'transition-group': false,
      },
      plugins: [vuetify],
    },
  }

  const mountOptions = {
    ...defaultOptions,
    ...options,
  }

  return _render(component, mountOptions)
}