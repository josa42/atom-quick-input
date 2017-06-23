'use babel'

import { Disposable, CompositeDisposable, TextEditor } from 'atom'
import etch from 'etch'

const $ = etch.dom
const { atom } = global

function addEventListener (element, type, handler) {
  element.addEventListener(type, handler)
  return new Disposable(() => {
    element.removeEventListener(type, handler)
  })
}

export default class QuickInputView {
  constructor (props, doneCallback) {
    this.props = props
    this.doneCallback = doneCallback
    this.disposables = new CompositeDisposable()

    etch.initialize(this)
    this.update(props)

    this.element.classList.add('quick-input')

    this.disposables.add(atom.commands.add(this.element, {
      'core:confirm': (event) => {
        this.confirm()
        event.stopPropagation()
      },
      'core:cancel': (event) => {
        this.cancel()
        event.stopPropagation()
      }
    }))

    addEventListener(this.refs.editor.element, 'blur', this.didLoseFocus.bind(this))
  }

  render () {
    return $.div({}, $(TextEditor, { ref: 'editor', mini: true }))
  }

  update (props = {}) {
    if (props.value !== undefined) {
      this.refs.editor.setText(props.value)
    }
    return etch.update(this)
  }

  show () {
    this.previouslyFocusedElement = document.activeElement
    if (!this.panel) {
      this.panel = atom.workspace.addModalPanel({ item: this })
    }
    this.panel.show()
    this.refs.editor.element.focus()
  }

  hide () {
    if (this.panel) {
      this.panel.hide()
    }

    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus()
      this.previouslyFocusedElement = null
    }
  }

  async destroy () {
    if (this.panel) {
      this.panel.destroy()
    }

    if (this.subscriptions) {
      this.subscriptions.dispose()
      this.subscriptions = null
    }

    await etch.destroy(this)
  }

  didLoseFocus (event) {
    if (this.element.contains(event.relatedTarget)) {
      this.refs.queryEditor.element.focus()
    } else if (document.hasFocus()) {
      this.destroy()
    }
  }

  confirm () {
    const value = this.refs.editor.getText()
    if (value !== '') {
      this.doneCallback(value)
    } else {
      this.doneCallback()
    }

    this.destroy()
  }

  cancel () {
    this.doneCallback()
    this.destroy()
  }
}
