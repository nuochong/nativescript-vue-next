import {
  Frame as TNSFrame,
  Page as TNSPage,
  ViewBase as TNSViewBase
} from '@nativescript/core'
import { NSVElement, NSVViewFlags } from './nodes'
import { actionBarNodeOps } from './components/ActionBar'
import { warn } from '@vue/runtime-core'

export type NSVElementResolver = () => TNSViewBase

export interface NSVViewMeta {
  viewFlags: NSVViewFlags
  nodeOps?: {
    insert(child: NSVElement, parent: NSVElement, atIndex?: number): void
    remove(child: NSVElement, parent: NSVElement): void
  }
}

export interface NSVElementDescriptor {
  meta: NSVViewMeta
  resolver?: NSVElementResolver
}

let defaultViewMeta: NSVViewMeta = {
  viewFlags: NSVViewFlags.NONE
}

let elementMap: Record<string, NSVElementDescriptor> = {}

export function getViewMeta(elementName: string): NSVViewMeta {
  console.log(`->getViewMeta(${elementName})`)

  const normalizedName = normalizeElementName(elementName)

  const entry = elementMap[normalizedName]

  if (!entry) {
    throw new Error(`No known component for element ${elementName}.`)
  }

  return entry.meta
}

export function getViewClass(elementName: string): any {
  console.log(`->getViewClass(${elementName})`)
  const normalizedName = normalizeElementName(elementName)
  const entry = elementMap[normalizedName]

  if (!entry) {
    throw new Error(`No known component for element ${elementName}.`)
  }

  try {
    if (__TEST__) {
      // if we passed a custom test view return that
      if (entry.meta.viewFlags & NSVViewFlags.TEST_VIEW) {
        return entry.resolver!()
      }
      // otherwise
      // todo: perhaps return a mock here?
    }
    return entry.resolver!()
  } catch (e) {
    throw new Error(`Could not load view for: ${elementName}. ${e}`)
  }
}

export function normalizeElementName(elementName: string): string {
  return elementName.replace(/-/g, '').toLowerCase()
}

export function registerElement(
  elementName: string,
  resolver?: NSVElementResolver,
  meta?: Partial<NSVViewMeta>
) {
  const normalizedName = normalizeElementName(elementName)
  const mergedMeta = Object.assign({}, defaultViewMeta, meta)

  if (elementMap[normalizedName]) {
    throw new Error(`Element for ${elementName} already registered.`)
  }

  elementMap[normalizedName] = {
    meta: mergedMeta,
    resolver
  }
  console.log(`->registerElement(${elementName})`)
}

// istanbul ignore next
export function registerTestElement(
  elementName: string,
  resolver?: () => any,
  meta?: Partial<NSVViewMeta>
) {
  if (__TEST__) {
    const normalizedName = normalizeElementName(elementName)
    const mergedMeta = Object.assign({}, defaultViewMeta, meta)
    mergedMeta.viewFlags |= NSVViewFlags.TEST_VIEW

    elementMap[normalizedName] = {
      meta: mergedMeta,
      resolver
    }
  }
}

// export function isKnownView(elementName: string) {
//     return elementMap.hasOwnProperty(normalizeElementName(elementName))
// }

// register built in elements
// prettier-ignore
{
  // layouts
  registerElement(
    'AbsoluteLayout',
    () => require('@nativescript/core/ui/layouts/absolute-layout').AbsoluteLayout,
    { viewFlags: NSVViewFlags.LAYOUT_VIEW }
  )
  registerElement(
    'DockLayout',
    () => require('@nativescript/core/ui/layouts/dock-layout').DockLayout,
    { viewFlags: NSVViewFlags.LAYOUT_VIEW }
  )
  registerElement(
    'FlexboxLayout',
    () => require('@nativescript/core/ui/layouts/flexbox-layout').FlexboxLayout,
    { viewFlags: NSVViewFlags.LAYOUT_VIEW }
  )
  registerElement(
    'GridLayout',
    () => require('@nativescript/core/ui/layouts/grid-layout').GridLayout,
    { viewFlags: NSVViewFlags.LAYOUT_VIEW }
  )
  registerElement(
    'StackLayout',
    () => require('@nativescript/core/ui/layouts/stack-layout').StackLayout,
    { viewFlags: NSVViewFlags.LAYOUT_VIEW }
  )
  registerElement(
    'WrapLayout',
    () => require('@nativescript/core/ui/layouts/wrap-layout').WrapLayout,
    { viewFlags: NSVViewFlags.LAYOUT_VIEW }
  )

  // ContentViews
  registerElement(
    'ContentView',
    () => require('@nativescript/core/ui/content-view').ContentView,
    { viewFlags: NSVViewFlags.CONTENT_VIEW }
  )
  registerElement(
    'ScrollView',
    () => require('@nativescript/core/ui/scroll-view').ScrollView,
    { viewFlags: NSVViewFlags.CONTENT_VIEW }
  )

  // ActionBar
  registerElement(
    'InternalActionBar',
    () => require('@nativescript/core/ui/action-bar').ActionBar,
    {
      viewFlags: NSVViewFlags.SKIP_ADD_TO_DOM,
      nodeOps: actionBarNodeOps
    }
  )
  registerElement(
    'ActionItem',
    () => require('@nativescript/core/ui/action-bar').ActionItem
  )
  registerElement(
    'NavigationButton',
    () => require('@nativescript/core/ui/action-bar').NavigationButton
  )

  // navigation
  registerElement(
    'Frame',
    () => require('@nativescript/core/ui/frame').Frame,
    {
      // todo: move into Frame.ts when we end up creating a component for Frame
      nodeOps: {
        insert(child: NSVElement, parent: NSVElement, atIndex?: number): void {
          const frame = parent.nativeView as TNSFrame
          if (child.nativeView instanceof TNSPage) {
            frame.navigate({
              create() {
                return child.nativeView
              }
            })
          } else {
            if (__DEV__) {
              warn(
                `<Frame> must only contain <Page> elements - ` +
                `got <${child.nativeView.constructor.name}> instead.`
              )
            }
          }
        },
        remove(child: NSVElement, parent: NSVElement): void {
          // ignore? warn? throw? navigate back?
        }
      }
    }
  )
  registerElement(
    'Page',
    () => require('@nativescript/core/ui/page').Page,
    { viewFlags: NSVViewFlags.CONTENT_VIEW }
  )

  // html
  registerElement(
    'HtmlView',
    () => require('@nativescript/core/ui/html-view').HtmlView
  )
  registerElement(
    'WebView',
    () => require('@nativescript/core/ui/web-view').WebView
  )

  // components
  registerElement(
    'ActivityIndicator',
    () => require('@nativescript/core/ui/activity-indicator').ActivityIndicator
  )
  registerElement(
    'Button',
    () => require('@nativescript/core/ui/button').Button
  )
  registerElement(
    'DatePicker',
    () => require('@nativescript/core/ui/date-picker').DatePicker
  )
  registerElement(
    'Image',
    () => require('@nativescript/core/ui/image').Image
  )
  registerElement(
    'Label',
    () => require('@nativescript/core/ui/label').Label
  )
}
// todo: more
