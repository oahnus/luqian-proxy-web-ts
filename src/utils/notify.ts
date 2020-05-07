import {Message} from 'element-ui'
function notifySuccess(msg: string): void {
  Message({
    message: msg,
    type: 'success'
  })
}
function notifyErr(msg: string): void {
  Message({
    message: msg,
    type: 'error'
  })
}
function notifyWarning(msg: string): void {
  Message({
    message: msg,
    type: 'warning'
  })
}

export default {
  success: notifySuccess,
  error: notifyErr,
  warning: notifyWarning,
}
