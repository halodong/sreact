// NOTE This file is auto-generated by Contentlayer

export { isType } from 'contentlayer/client'

// NOTE During development Contentlayer imports from `.mjs` files to improve HMR speeds.
// During (production) builds Contentlayer it imports from `.json` files to improve build performance.
import { allPosts } from './Post/_index.mjs'
import { allMarkdowns } from './Markdown/_index.mjs'

export { allPosts, allMarkdowns }

export const allDocuments = [...allPosts, ...allMarkdowns]


