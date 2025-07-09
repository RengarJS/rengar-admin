import { timestampVersionPlugin } from '@rengar-admin/vite-plugin-version'

export function setupVersion() {
  return timestampVersionPlugin({
    fileName: 'version.json', // 可选
    versionPrefix: 'build-', // 可选，默认 'v'
    includeBuildTime: true, // 可选
    useShortTimestamp: false, // 可选，使用10位时间戳
  })
}
