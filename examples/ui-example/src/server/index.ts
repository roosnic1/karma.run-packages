#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import {createServer} from 'http'

import {findEntryFromAssetList} from '@karma.run/webpack'
import {ElementID} from '../shared/elementID'

async function asyncMain() {
  const staticHost = process.env.STATIC_HOST

  const assetList = JSON.parse(
    await fs.promises.readFile(path.resolve(__dirname, '../assetList.json'), 'utf-8')
  )

  const entry = findEntryFromAssetList('client', assetList)

  if (!entry) throw new Error("Couldn't find entry in asset list.")

  const server = createServer((_req, res) => {
    const htmlString = `
        <html>
          <head>
            <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet">
            <script async src="${staticHost}/${entry}"></script>
          </head>
          <body><div id="${ElementID.ReactRoot}"></div></body>
        </html>
      `

    res.setHeader('content-type', 'text/html')
    res.setHeader('content-length', Buffer.byteLength(htmlString))

    res.write(htmlString)
    res.end()
  })

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3011
  const address = process.env.ADDRESS || 'localhost'

  server.listen(port, address)

  console.log(`Server listening: http://${address}:${port}`)
}

asyncMain().catch(err => {
  console.error(err)
  process.exit(1)
})
