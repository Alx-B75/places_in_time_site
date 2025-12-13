import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const guestChatPath = path.join(repoRoot, 'src', 'pages', 'GuestChat.jsx')
const appPath = path.join(repoRoot, 'src', 'App.jsx')

const guestChatSrc = readFileSync(guestChatPath, 'utf8')
const appSrc = readFileSync(appPath, 'utf8')

const assert = (condition, message) => {
  if (!condition) {
    console.error(`Guest chat routing guard failed: ${message}`)
    process.exit(1)
  }
}

assert(
  guestChatSrc.includes('export default GuestChat') || guestChatSrc.includes('export default function GuestChat'),
  'GuestChat component must export the in-site chat UI.',
)

const legacyUrlMatches = guestChatSrc.match(/https:\/\/places-in-time-history-chat-front\.onrender\.com\/(login|register)/g) || []
assert(legacyUrlMatches.length === 2, 'GuestChat must reference legacy frontend only for login and register links.')

assert(!/window\.location/.test(guestChatSrc), 'GuestChat must not change window.location during guest flow.')
assert(!/RedirectPage/.test(guestChatSrc), 'GuestChat must not rely on RedirectPage for guest flow.')

assert(/path="\/guest\/:slug"/.test(appSrc), 'App router must expose /guest/:slug route for in-site chat.')

console.log('Guest chat routing guard passed.')
