import vuetify from './vuetify'
import { createPinia } from 'pinia'

export function registerPlugins (app: any): void {
  app.use(vuetify)
  app.use(createPinia())
}