import CodeTabs from '../../../../components/CodeTabs';

export default function SubscribingGuide() {
    return (
        <>
            <h1>How to Subscribe</h1>
            <p>A step-by-step guide for AI agents and services that want to receive real-time events from EEP entities.</p>

            <h2>Step 1: Discover the EEP Endpoint</h2>
            <p>Resolve the entity and look for the <code>Link</code> header:</p>
            <pre><code>{`GET /u/acme-corp HTTP/1.1
Accept: application/json

HTTP/1.1 200 OK
Link: <https://api.example.com/eep/subscribe>; rel="subscribe"
Link: <https://api.example.com/eep/stream?source=acme-corp>; rel="monitor"`}</code></pre>

            <h2>Step 2: Choose a Delivery Method</h2>
            <table>
                <thead><tr><th>Method</th><th>Best For</th><th>Setup</th></tr></thead>
                <tbody>
                    <tr><td><strong>Webhook</strong></td><td>Server-side agents with a public URL</td><td>You provide a URL, we POST events to it</td></tr>
                    <tr><td><strong>SSE</strong></td><td>Lightweight subscribers, browser-based, CLI</td><td>You open a long-lived HTTP connection</td></tr>
                    <tr><td><strong>WebSocket</strong></td><td>Bidirectional, interactive, low-latency</td><td>Full duplex — send and receive</td></tr>
                </tbody>
            </table>

            <h2>Step 3: Create a Subscription (Webhook)</h2>
            <CodeTabs label="Create Subscription"
                ts={`const res = await fetch('https://api.example.com/eep/subscribe', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    source_did: 'did:web:example.com:u:acme-corp',
    event_types: ['com.example.entity.updated', 'com.example.trust.*'],
    delivery_method: 'webhook',
    delivery_url: 'https://your-agent.example.com/hooks/eep',
  }),
});
const subscription = await res.json();`}
                py={`import httpx

res = await httpx.post(
    "https://api.example.com/eep/subscribe",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    },
    json={
        "source_did": "did:web:example.com:u:acme-corp",
        "event_types": ["com.example.entity.updated", "com.example.trust.*"],
        "delivery_method": "webhook",
        "delivery_url": "https://your-agent.example.com/hooks/eep",
    },
)
subscription = res.json()`}
            />

            <h2>Step 4: Handle Intent Verification</h2>
            <p>Your endpoint will receive a GET request with a challenge:</p>
            <CodeTabs label="Intent Verification Handler"
                ts={`// Express / Hono
app.get('/hooks/eep', (req, res) => {
  const challenge = req.query['hub.challenge'];
  if (challenge) {
    return res.status(200).send(challenge);
  }
  res.status(400).send('Missing challenge');
});`}
                py={`# FastAPI
@app.get("/hooks/eep")
async def verify_intent(request: Request):
    challenge = request.query_params.get("hub.challenge")
    if challenge:
        return PlainTextResponse(challenge, status_code=200)
    return PlainTextResponse("Missing challenge", status_code=400)`}
            />

            <h2>Step 5: Verify Incoming Webhooks</h2>
            <CodeTabs label="Webhook Verification"
                ts={`import { verifyEEPWebhook } from '@eep-dev/signer';

app.post('/hooks/eep', (req, res) => {
  const valid = verifyEEPWebhook(req.rawBody, req.headers, YOUR_SECRET);
  if (!valid) return res.status(401).send('Invalid signature');

  const event = JSON.parse(req.body);
  console.log(\`Event: \${event.type} from \${event.source}\`);
  res.status(200).send('OK');
});`}
                py={`from eep_signer import verify_eep_webhook

@app.post("/hooks/eep")
async def handle_webhook(request: Request):
    raw_body = await request.body()
    valid = verify_eep_webhook(raw_body, dict(request.headers), YOUR_SECRET)
    if not valid:
        return PlainTextResponse("Invalid signature", status_code=401)

    event = json.loads(raw_body)
    print(f"Event: {event['type']} from {event['source']}")
    return PlainTextResponse("OK", status_code=200)`}
            />

            <h2>Alternative: SSE Stream</h2>
            <p>
                <strong>Browser limitation:</strong> the standard <code>EventSource</code> API cannot set custom headers (including{' '}
                <code>Authorization</code>). Use a server-side subscriber, a fetch/SSE polyfill that supports headers, or a token
                mechanism your publisher documents (for example query parameters), never hard-coding secrets in client-side code.
            </p>
            <CodeTabs label="SSE Client"
                ts={`// Node (eventsource package) or polyfill that supports headers:
const es = new EventSource(
  'https://api.example.com/eep/stream?source=acme-corp&events=entity.*,trust.*',
  { headers: { 'Authorization': 'Bearer YOUR_API_KEY' } }
);

es.onmessage = (e) => {
  const event = JSON.parse(e.data);
  console.log(event.type, event.data);
};

es.onerror = () => {
  // Will auto-reconnect with Last-Event-ID
};`}
                py={`import httpx_sse

async with httpx.AsyncClient() as client:
    async with httpx_sse.aconnect_sse(
        client, "GET",
        "https://api.example.com/eep/stream",
        params={"source": "acme-corp", "events": "entity.*,trust.*"},
        headers={"Authorization": "Bearer YOUR_API_KEY"},
    ) as sse:
        async for event in sse.aiter_sse():
            data = json.loads(event.data)
            print(f"{data['type']}: {data['data']}")`}
            />
        </>
    );
}
