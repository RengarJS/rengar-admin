import { TreeNode, RouterMap } from './types'
export declare function parseExitsRouteFile(filePath: string): Map<string, RouterMap>
export declare function collectRouteNames(routes: TreeNode[]): string[]
export declare function generateRouteNameType(names: string[]): string
export declare function generateRouteString(routes: TreeNode[], routerMap: Map<string, RouterMap>): string
export declare function generateRoutesTree(dir: string, rootDir: string): TreeNode[]
