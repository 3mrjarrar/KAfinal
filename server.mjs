import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const port = process.env.PORT || 10000
const apiUrl = (process.env.API_URL || 'https://knowledgeshop.runasp.net/api').replace(/\/$/, '')
const currentDirectory = path.dirname(fileURLToPath(import.meta.url))

app.set('trust proxy', 1)
app.disable('x-powered-by')

// Capture the raw body for ANY content-type so it is forwarded byte-for-byte
// (avoids the previous JSON.parse -> JSON.stringify round trip losing/altering data).
app.use('/api', express.raw({ type: '*/*', limit: '15mb' }))

app.use('/api', async (request, response) => {
  const apiPath = request.originalUrl.replace(/^\/api/, '') || '/'
  const targetUrl = `${apiUrl}${apiPath}`

  const forwardHeaders = {}
  const passthroughHeaders = ['accept', 'accept-language', 'authorization', 'content-type', 'cookie']
  for (const header of passthroughHeaders) {
    const value = request.get(header)
    if (value) forwardHeaders[header] = value
  }

  const hasBody =
    !['GET', 'HEAD'].includes(request.method) && Buffer.isBuffer(request.body) && request.body.length > 0

  console.log(`[proxy] -> ${request.method} ${targetUrl}`)

  try {
    const apiResponse = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body: hasBody ? request.body : undefined,
    })

    const setCookie =
      typeof apiResponse.headers.getSetCookie === 'function'
        ? apiResponse.headers.getSetCookie()
        : apiResponse.headers.get('set-cookie')
    if (setCookie && setCookie.length) response.set('Set-Cookie', setCookie)

    const contentType = apiResponse.headers.get('content-type')
    if (contentType) response.set('Content-Type', contentType)

    const bodyBuffer = Buffer.from(await apiResponse.arrayBuffer())
    response.status(apiResponse.status).send(bodyBuffer)

    console.log(`[proxy] <- ${apiResponse.status} ${request.method} ${apiPath}`)
  } catch (error) {
    console.error(`[proxy] FAILED ${request.method} ${targetUrl}:`, error)
    response.status(502).json({
      message: 'The upstream API service is currently unavailable.',
      error: error?.message || String(error),
    })
  }
})

app.use(express.static(path.join(currentDirectory, 'dist')))

app.use((request, response) => {
  response.sendFile(path.join(currentDirectory, 'dist', 'index.html'))
})

// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) => {
  console.error('[server] unhandled error:', error)
  response.status(500).json({ message: 'Internal server error.' })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`App is running on port ${port}`)
  console.log(`Proxying /api requests to ${apiUrl}`)
})
