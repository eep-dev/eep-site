import CodeTabs from '../../../../components/CodeTabs';

export default function DispatchingGuide() {
  return (
    <>
      <h1>How to Dispatch Events</h1>
      <p>A guide for platform developers implementing EEP event delivery.</p>

      <h2>1. Set Up an Event Bus</h2>
      <p>EEP doesn&apos;t mandate a specific message broker. Use Redis Streams, RabbitMQ, Kafka, or any reliable queue.</p>
      <CodeTabs label="Publish Event"
        ts={`import { randomUUID } from 'crypto';

await eventBus.publish({
  specversion: '1.0',
  id: randomUUID(),
  source: entity.did,
  type: 'com.example.entity.updated',
  time: new Date().toISOString(),
  datacontenttype: 'application/json',
  eep_version: '0.1',
  data: { field: 'bio', previous: oldBio, current: newBio },
});`}
        py={`import uuid
from datetime import datetime, timezone

await event_bus.publish({
    "specversion": "1.0",
    "id": str(uuid.uuid4()),
    "source": entity.did,
    "type": "com.example.entity.updated",
    "time": datetime.now(timezone.utc).isoformat(),
    "datacontenttype": "application/json",
    "eep_version": "0.1",
    "data": {"field": "bio", "previous": old_bio, "current": new_bio},
})`}
      />

      <h2>2. Implement Webhook Delivery</h2>
      <CodeTabs label="Deliver Webhook"
        ts={`import { EEPSigner } from '@eep-dev/signer';
import { validateSSRF } from '@eep-dev/validator';

async function deliverWebhook(subscription, event) {
  // SSRF check BEFORE connecting
  await validateSSRF(subscription.delivery_url);

  const signer = new EEPSigner(subscription.delivery_secret);
  const webhookId = \`msg_\${event.id}\`;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const body = JSON.stringify(event);
  const signature = signer.sign(webhookId, timestamp, body);

  const response = await fetch(subscription.delivery_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'webhook-id': webhookId,
      'webhook-timestamp': timestamp,
      'webhook-signature': \`v1,\${signature}\`,
      'EEP-Version': '0.1',
    },
    body,
    redirect: 'error',
    signal: AbortSignal.timeout(10000),
  });

  return response.ok;
}`}
        py={`from eep_signer import EEPSigner
from eep_validator import validate_ssrf
import httpx, time, json

async def deliver_webhook(subscription, event):
    # SSRF check BEFORE connecting
    await validate_ssrf(subscription.delivery_url)

    signer = EEPSigner(subscription.delivery_secret)
    webhook_id = f"msg_{event['id']}"
    timestamp = str(int(time.time()))
    body = json.dumps(event)
    signature = signer.sign(webhook_id, timestamp, body)

    async with httpx.AsyncClient() as client:
        response = await client.post(
            subscription.delivery_url,
            headers={
                "Content-Type": "application/json",
                "webhook-id": webhook_id,
                "webhook-timestamp": timestamp,
                "webhook-signature": f"v1,{signature}",
                "EEP-Version": "0.1",
            },
            content=body,
            timeout=10.0,
            follow_redirects=False,
        )

    return response.is_success`}
      />

      <h2>3. Implement Retry with Exponential Backoff</h2>
      <p>
        The specification defines a normative webhook retry schedule (several attempts with increasing delays). Align your
        production dispatcher with{' '}
        <a href="https://github.com/eep-dev/EEP/blob/main/docs/current/SPECIFICATION.md" target="_blank" rel="noopener noreferrer">
          SPECIFICATION.md
        </a>{' '}
        — the loop below is illustrative only.
      </p>
      <CodeTabs label="Retry Logic"
        ts={`const MAX_RETRIES = 5;
const BASE_DELAY = 1000; // 1 second

async function deliverWithRetry(subscription, event) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const ok = await deliverWebhook(subscription, event);
      if (ok) return true;
    } catch (err) {
      // Network error
    }
    const delay = BASE_DELAY * Math.pow(2, attempt);
    await new Promise(r => setTimeout(r, delay));
  }
  // After 5 failures, pause subscription
  await pauseSubscription(subscription.id);
  return false;
}`}
        py={`import asyncio

MAX_RETRIES = 5
BASE_DELAY = 1.0  # seconds

async def deliver_with_retry(subscription, event):
    for attempt in range(MAX_RETRIES):
        try:
            ok = await deliver_webhook(subscription, event)
            if ok:
                return True
        except Exception:
            pass  # Network error
        delay = BASE_DELAY * (2 ** attempt)
        await asyncio.sleep(delay)

    # After 5 failures, pause subscription
    await pause_subscription(subscription.id)
    return False`}
      />

      <h2>4. Implement SSE Streaming</h2>
      <CodeTabs label="SSE Endpoint"
        ts={`// Hono framework
app.get('/eep/stream', async (c) => {
  const source = c.req.query('source');
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      eventBus.subscribe(source, (event) => {
        const chunk = \`id: \${event.id}\\nevent: \${event.type}\\ndata: \${JSON.stringify(event)}\\n\\n\`;
        controller.enqueue(encoder.encode(chunk));
      });

      // Heartbeat every 15s
      setInterval(() => {
        const hb = \`: heartbeat \${new Date().toISOString()}\\n\\n\`;
        controller.enqueue(encoder.encode(hb));
      }, 15000);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
});`}
        py={`# FastAPI with sse-starlette
from sse_starlette.sse import EventSourceResponse

@app.get("/eep/stream")
async def stream(source: str, request: Request):
    async def event_generator():
        async for event in event_bus.subscribe(source):
            yield {
                "id": event["id"],
                "event": event["type"],
                "data": json.dumps(event),
            }

    return EventSourceResponse(
        event_generator(),
        ping=15,  # heartbeat every 15s
    )`}
      />

      <h2>5. WebSub Intent Verification</h2>
      <p>Before activating any webhook subscription, verify the subscriber controls the URL by sending a GET challenge.</p>
      <CodeTabs label="Challenge Flow"
        ts={`import crypto from 'crypto';

async function verifyIntent(deliveryUrl: string, sourceDid: string) {
  const challenge = crypto.randomBytes(16).toString('hex');
  const url = new URL(deliveryUrl);
  url.searchParams.set('hub.mode', 'subscribe');
  url.searchParams.set('hub.topic', sourceDid);
  url.searchParams.set('hub.challenge', challenge);

  const res = await fetch(url.toString());
  const body = await res.text();

  return res.status === 200 && body.trim() === challenge;
}`}
        py={`import secrets, httpx

async def verify_intent(delivery_url: str, source_did: str) -> bool:
    challenge = secrets.token_hex(16)

    res = await httpx.AsyncClient().get(
        delivery_url,
        params={
            "hub.mode": "subscribe",
            "hub.topic": source_did,
            "hub.challenge": challenge,
        },
    )

    return res.status_code == 200 and res.text.strip() == challenge`}
      />
    </>
  );
}
