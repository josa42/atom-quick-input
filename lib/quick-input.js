'use babel'

import QuickInputView from './quick-input-view'

export default function quicInput (value = '') {
  return new Promise((resolve) => {
    let active = true

    const select = new QuickInputView({ value }, (selection) => {
      if (active) {
        resolve(selection)
      }

      // TODO: Move the active check into QuickInputView
      active = false
      select.destroy()
    })

    select.show()
  })
}
