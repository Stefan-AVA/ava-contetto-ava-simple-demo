interface Window {
  ReactNativeWebView?: {
    postMessage(msg: string): void
  }

  Electron?: {
    sendNotification: (options: INotificationOptions) => void
  }
}
