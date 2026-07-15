import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const port = process.env.PORT || 10000
const apiUrl = (process.env.API_URL || 'https://knowledgeshop.runasp.net/api').replace(/\/$/, '')
const currentDirectory = path.dirname(fileURLToPath(import.meta.url))

app.use('/api', express.json())

app.use('/api', async (request, response) => {
  const apiPath = request.originalUrl.replace(/^\/api/, '') || '/'

  try {
    const apiResponse = await fetch(`${apiUrl}${apiPath}`, {
      method: request.method,
      headers: {
        'Accept-Language': request.get('Accept-Language') || 'en',
        ...(request.is('application/json') ? { 'Content-Type': 'application/json' } : {}),
      },
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : JSON.stringify(request.body),
    })

    const contentType = apiResponse.headers.get('content-type')
    if (contentType) response.set('Content-Type', contentType)
    response.status(apiResponse.status).send(await apiResponse.text())
  } catch {
    response.status(502).json({ message: 'The categories service is currently unavailable.' })
  }
})

app.use(express.static(path.join(currentDirectory, 'dist')))
app.use((request, response) => {
  response.sendFile(path.join(currentDirectory, 'dist', 'index.html'))
})

app.listen(port, () => {
  console.log(`App is running on port ${port}`)
})
