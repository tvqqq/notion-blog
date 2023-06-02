export default async function handler(req, res) {
  const buildHookUrl = process.env.BUILD_HOOK_URL
  if (!buildHookUrl) {
    return res.status(400).end('No Build Hook Cron!')
  }
  let result = null
  await fetch(buildHookUrl, {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  })
    .then((response) => response.json())
    .then(async (data) => {
      result = data
    })
    .catch((error) => {
      console.log('error', error)
    })
  return res.status(200).json(result)
}
