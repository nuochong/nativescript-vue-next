import { NSVElement } from '../../src/nodes'
import { patchStyle } from '../../src/modules/style'

describe('module style', () => {
  it('string', () => {
    const el = new NSVElement('StackLayout')
    patchStyle(el, '', 'color: red')
    expect(el.style).toBe('color: red')
    expect(el.nativeView.resettedCSSProps).toEqual([])
  })

  it('!important', () => {
    const el = new NSVElement('StackLayout')
    patchStyle(el, '', 'color: red !important')
    expect(el.style).toBe('color: red !important')
    expect(el.nativeView.resettedCSSProps).toEqual([])
  })

  it('object with multiple entries', () => {
    const el = new NSVElement('StackLayout')
    patchStyle(el, '', 'color: red, margin-right: 10px')
    expect(el.style).toBe('color: red, margin-right: 10px')
    expect(el.nativeView.resettedCSSProps).toEqual([])
  })

  it('object had a previous style', () => {
    const el = new NSVElement('StackLayout')
    patchStyle(el, 'color: yellow', 'color: red')
    expect(el.style).toBe('color: red')
    expect(el.nativeView.resettedCSSProps).toEqual(['color'])
  })

  it('object had multiple previous styles', () => {
    const el = new NSVElement('StackLayout')
    patchStyle(el, 'color: yellow; margin-top: 10px', 'color: red')
    expect(el.style).toBe('color: red')
    expect(el.nativeView.resettedCSSProps).toEqual(['color', 'margin-top'])
  })

  it('object style is resetted', () => {
    const el = new NSVElement('StackLayout')
    patchStyle(el, 'color: yellow', '')
    expect(el.style).toBe(undefined)
    expect(el.nativeView.resettedCSSProps).toEqual(['color'])
  })
})
