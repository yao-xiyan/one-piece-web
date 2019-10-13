/**
 * 一个专门操作本地存储的API模块
 */

export const getItem = (name) => {
  return JSON.parse(window.localStorage.getItem(name))
}
export const setItem = (name, data) => {
  return window.localStorage.setItem(name, JSON.stringify(data))
}
export const removeItem = name => {
  window.localStorage.removeItem(name)
}
