export const metadata = { title: 'Event Catalog — EEP' };

export default function EventsPage() {
    return (
        <>
            <h1>Standard Event Catalog</h1>
            <p>EEP defines a set of standard event types using reverse-domain dot notation.</p>

            <h2>Naming Convention</h2>
            <pre><code>{`{reverse-domain}.{entity-type}.{action}

Examples:
  com.example.entity.updated
  com.example.trust.changed
  com.example.commerce.offer`}</code></pre>
            <p><strong>Wildcard matching:</strong> <code>com.example.entity.*</code> matches all entity events. Only prefix matching is supported.</p>

            <h2>Entity Lifecycle</h2>
            <table>
                <thead><tr><th>Event Type</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><code>com.example.entity.created</code></td><td>A new entity profile was created</td></tr>
                    <tr><td><code>com.example.entity.updated</code></td><td>One or more profile fields changed</td></tr>
                    <tr><td><code>com.example.entity.deleted</code></td><td>An entity was permanently deleted</td></tr>
                    <tr><td><code>com.example.entity.activated</code></td><td>A deactivated entity was reactivated</td></tr>
                    <tr><td><code>com.example.entity.deactivated</code></td><td>Temporarily deactivated</td></tr>
                </tbody>
            </table>

            <h2>Trust and Identity</h2>
            <table>
                <thead><tr><th>Event Type</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><code>com.example.trust.changed</code></td><td>Trust score changed (includes previous and current values)</td></tr>
                    <tr><td><code>com.example.trust.signal.added</code></td><td>A positive or negative trust signal was recorded</td></tr>
                    <tr><td><code>com.example.identity.verified</code></td><td>Domain, email, or credential verification completed</td></tr>
                    <tr><td><code>com.example.identity.did_updated</code></td><td>The entity&apos;s DID document was updated</td></tr>
                </tbody>
            </table>

            <h2>Content</h2>
            <table>
                <thead><tr><th>Event Type</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><code>com.example.content.published</code></td><td>A new page or post was published</td></tr>
                    <tr><td><code>com.example.content.updated</code></td><td>Existing content was modified</td></tr>
                    <tr><td><code>com.example.content.deleted</code></td><td>Content was deleted</td></tr>
                </tbody>
            </table>

            <h2>Connections</h2>
            <table>
                <thead><tr><th>Event Type</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><code>com.example.connection.followed</code></td><td>An entity gained a new follower</td></tr>
                    <tr><td><code>com.example.connection.unfollowed</code></td><td>A follower disconnected</td></tr>
                </tbody>
            </table>

            <h2>Agent Events</h2>
            <table>
                <thead><tr><th>Event Type</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><code>com.example.agent.access.read</code></td><td>An AI agent read this entity&apos;s profile</td></tr>
                    <tr><td><code>com.example.agent.access.search</code></td><td>An AI agent found this entity via search</td></tr>
                    <tr><td><code>com.example.agent.task.received</code></td><td>An A2A task was submitted</td></tr>
                    <tr><td><code>com.example.agent.task.completed</code></td><td>An A2A task completed successfully</td></tr>
                    <tr><td><code>com.example.agent.task.failed</code></td><td>An A2A task failed</td></tr>
                </tbody>
            </table>

            <h2>Commerce and Marketplace</h2>
            <table>
                <thead><tr><th>Event Type</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><code>com.example.commerce.offer</code></td><td>A new price offer was made</td></tr>
                    <tr><td><code>com.example.commerce.counter</code></td><td>A counter-offer was made</td></tr>
                    <tr><td><code>com.example.commerce.accepted</code></td><td>A negotiation was accepted</td></tr>
                    <tr><td><code>com.example.commerce.rejected</code></td><td>A negotiation was rejected</td></tr>
                    <tr><td><code>com.example.commerce.invoiced</code></td><td>An invoice was generated</td></tr>
                    <tr><td><code>com.example.commerce.paid</code></td><td>Payment was confirmed</td></tr>
                    <tr><td><code>com.example.commerce.completed</code></td><td>A commerce transaction completed</td></tr>
                    <tr><td><code>com.example.commerce.disputed</code></td><td>A dispute was raised</td></tr>
                    <tr><td><code>com.example.service.listed</code></td><td>A new service was published</td></tr>
                    <tr><td><code>com.example.service.updated</code></td><td>A service listing was updated</td></tr>
                    <tr><td><code>com.example.service.delisted</code></td><td>A service was removed</td></tr>
                    <tr><td><code>com.example.gate.config_changed</code></td><td>Gate configuration was updated</td></tr>
                    <tr><td><code>com.example.gate.access_granted</code></td><td>Access to a new tier was granted</td></tr>
                </tbody>
            </table>
        </>
    );
}
