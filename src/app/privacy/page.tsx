import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - ParkIt",
  description: "Privacy Policy for ParkIt parking marketplace.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: July 18, 2026</p>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <section>
          <p>ParkIt (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>

          <h3 className="text-lg font-medium text-foreground mt-4">Information You Provide</h3>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Account information:</strong> name, email address, profile image (including from Google OAuth if you sign in with Google)</li>
            <li><strong>Payment information:</strong> processed securely by Stripe; we do not store credit card numbers</li>
            <li><strong>Listings:</strong> parking space details, location, photos, descriptions, and pricing you submit</li>
            <li><strong>Bookings:</strong> reservation details and communications with other users</li>
            <li><strong>Reviews:</strong> ratings and feedback you leave for other users</li>
            <li><strong>Communications:</strong> messages you send through the Platform or to our support team</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4">Information Collected Automatically</h3>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Device information:</strong> browser type, operating system, device identifiers</li>
            <li><strong>Usage data:</strong> pages visited, features used, time spent on the Platform</li>
            <li><strong>Location data:</strong> approximate location based on IP address; precise location only with your explicit permission</li>
            <li><strong>Cookies and similar technologies:</strong> session cookies, analytics cookies, and authentication tokens</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Provide, operate, and maintain the Platform</li>
            <li>Process transactions and send related information (confirmations, receipts)</li>
            <li>Connect Hosts and Guests to facilitate parking bookings</li>
            <li>Send administrative notifications (account updates, security alerts)</li>
            <li>Improve and personalize your experience</li>
            <li>Detect and prevent fraud, abuse, or security issues</li>
            <li>Comply with legal obligations</li>
            <li>Communicate with you about promotions, updates, or new features (with opt-out available)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. How We Share Your Information</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Other users:</strong> Hosts see Guest names for bookings; Guests see Host names and listing details</li>
            <li><strong>Service providers:</strong> Stripe (payments), Vercel (hosting), Turso (database), Google (authentication), and other third parties that help us operate the Platform</li>
            <li><strong>Legal authorities:</strong> when required by law, subpoena, or court order</li>
            <li><strong>Business transfers:</strong> in connection with a merger, acquisition, or sale of assets</li>
          </ul>
          <p className="mt-2">We do not sell your personal information to advertisers or third parties.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Data Retention</h2>
          <p>We retain your information for as long as your account is active or as needed to provide services. If you delete your account, we will remove your personal data within 30 days, except where we are required to retain certain records for legal or legitimate business purposes.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Data Security</h2>
          <p>We implement industry-standard security measures including encryption in transit (TLS/HTTPS) and at rest, secure authentication via OAuth, and access controls on our infrastructure. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Access the personal information we hold about you</li>
            <li>Correct inaccurate or incomplete data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to or restrict certain processing of your data</li>
            <li>Data portability — receive a copy of your data in a portable format</li>
            <li>Withdraw consent where processing is based on consent</li>
          </ul>
          <p className="mt-2">To exercise any of these rights, contact us at support@parkit.com. We will respond within 30 days.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Cookies</h2>
          <p>We use cookies for:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Essential cookies:</strong> required for authentication and security</li>
            <li><strong>Preference cookies:</strong> remember your settings and preferences</li>
            <li><strong>Analytics cookies:</strong> help us understand how the Platform is used</li>
          </ul>
          <p className="mt-2">You can control cookies through your browser settings. Disabling essential cookies may prevent the Platform from functioning properly.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">8. Third-Party Links</h2>
          <p>The Platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any information.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">9. Children&apos;s Privacy</h2>
          <p>The Platform is not intended for children under 13. We do not knowingly collect information from children under 13. If you believe a child has provided us with personal data, contact us immediately and we will delete it.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on the Platform and updating the &quot;Last updated&quot; date. Your continued use after changes take effect constitutes acceptance of the updated policy.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">11. Contact Us</h2>
          <p>For questions about this Privacy Policy or to exercise your data rights, contact us at:</p>
          <p className="mt-2">Email: support@parkit.com</p>
        </section>
      </div>
    </div>
  );
}
