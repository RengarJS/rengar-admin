import { PluginOption } from 'vite'
export interface GitVersionPluginOptions {
  fileName?: string
  versionPrefix?: string
  includeBuildTime?: boolean
  useShortTimestamp?: boolean
}
export declare function timestampVersionPlugin(options?: GitVersionPluginOptions): PluginOption
