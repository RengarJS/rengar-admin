export {}

declare global {
  interface Window {
    $progress: import('nprogress').NProgress
    $loadingBar: import('naive-ui').LoadingBarProviderInst
    $dialog: import('naive-ui').DialogProviderInst
    $message: import('naive-ui').MessageProviderInst
    $notification: import('naive-ui').NotificationProviderInst
  }
}
