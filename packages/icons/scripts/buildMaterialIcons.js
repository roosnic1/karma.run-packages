const {promises: fs} = require('fs')
const path = require('path')

const svgr = require('@svgr/core').default
const axios = require('axios').default

const outputPath = process.argv.slice(2)[0]

function template({template}, _opts, {componentName, jsx}) {
  const typeScriptTemplate = template.smart({plugins: ['typescript']})
  return typeScriptTemplate.ast`export function ${componentName}(props: SVGProps<SVGSVGElement>) {return ${jsx}}`
}

function snakeCaseToPascalCase(str) {
  return str.replace(/(([-_]|^)[a-z0-9])/gi, group =>
    group
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  )
}

async function getIconList() {
  const response = await axios.get('https://fonts.google.com/metadata/icons')
  const text = response.data.replace(")]}'", '')
  const {asset_url_pattern: assetURLPattern, families, icons} = JSON.parse(text)

  const urls = families.reduce(
    (acc, family) => [
      ...acc,
      ...icons.map(icon => [
        snakeCaseToPascalCase(icon.name),
        family.replace('Material Icons', '').replace(/ /gi, ''),
        'https://fonts.gstatic.com' +
          assetURLPattern
            .replace('{family}', family.replace(/ /gi, '').toLowerCase())
            .replace('{icon}', icon.name)
            .replace('{version}', icon.version)
            .replace('{asset}', '24px.svg')
      ])
    ],
    []
  )

  const familySources = []
  const processed = {}

  for (const [index, [name, family, url]] of urls.entries()) {
    console.log(`${index} / ${urls.length}`)

    const fullName = `${name}${family}`

    if (processed[fullName]) continue

    const svgSource = (await axios.get(url)).data
    const source = await svgr(
      svgSource,
      {
        dimensions: false,
        template
      },
      {componentName: `MaterialIcon${fullName}`}
    )

    processed[fullName] = true

    if (!familySources[family]) {
      familySources[family] = []
    }

    familySources[family].push(source)
  }

  for (const [family, sources] of Object.entries(familySources)) {
    await fs.writeFile(
      path.join(outputPath, `materialIcons${family}.tsx`),
      `// THIS FILE IS AUTOGENERATED, EDIT WITH CAUTION
//
// This file includes Material Design Icons converted to React components:
// https://material.io/resources/icons/
//
// Material Design Icons are licensed under the Apache License Version 2.0:
// https://www.apache.org/licenses/LICENSE-2.0.html

import React, {SVGProps} from 'react'

${sources.join('\n\n')}`
    )
  }
}

async function main() {
  await getIconList()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})