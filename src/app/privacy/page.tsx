import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - ParkIt",
  description: "Privacy Policy for ParkIt parking marketplace.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: July 22, 2026</p>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <section>
          <p>ParkIt (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services. By using ParkIt, you consent to the practices described in this policy.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>

          <h3 className="text-lg font-medium text-foreground mt-4">Information You Provide</h3>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Account information:</strong> name, email address, profile image (including from Google OAuth if you sign in with Google)</li>
            <li><strong>Payment information:</strong> credit card details are processed and stored securely by Stripe. We never see or store your full card number. We retain your Stripe customer ID and payment method type for transaction records</li>
            <li><strong>Tax information:</strong> if you earn $600 or more through the Platform, we may collect your Social Security Number or Employer Identification Number via a W-9 form to comply with IRS 1099-K reporting requirements</li>
            <li><strong>Listings:</strong> parking space details, location, photos, descriptions, and pricing you submit</li>
            <li><strong>Bookings:</strong> reservation details and communications with other users</li>
            <li><strong>Reviews:</strong> ratings and feedback you leave for other users</li>
            <li><strong>Communications:</strong> messages you send through the Platform or to our support team</li>
            <li><strong>Damage claims:</strong> descriptions and photos submitted in connection with damage deposit disputes</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4">Information Collected Automatically</h3>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Device information:</strong> browser type, operating system, device identifiers, screen resolution</li>
            <li><strong>Usage data:</strong> pages visited, features used, time spent on the Platform, search queries, referral URLs</li>
            <li><strong>Location data:</strong> we collect your approximate location based on IP address for city-level search results. We collect your precise GPS location only with your explicit opt-in permission through your browser, and only to show your distance to nearby listings. Precise location data is not stored after your session</li>
            <li><strong>Log data:</strong> IP address, access times, pages viewed, and errors</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4">Information from Third Parties</h3>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Google OAuth:</strong> if you sign in with Google, we receive your name, email address, and profile photo from Google. We do not receive any other Google account data</li>
            <li><strong>Stripe:</strong> we receive transaction confirmation, payment status, and payout information from Stripe to facilitate bookings and payouts</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Provide, operate, and maintain the Platform</li>
            <li>Process transactions and send related information (confirmations, receipts, payouts)</li>
            <li>Connect Hosts and Guests to facilitate parking bookings</li>
            <li>Send administrative notifications (account updates, security alerts, booking confirmations)</li>
            <li>Improve and personalize your experience</li>
            <li>Detect and prevent fraud, abuse, or security issues</li>
            <li>Comply with legal obligations, including IRS tax reporting (1099-K)</li>
            <li>Resolve disputes and process damage claims</li>
            <li>Communicate with you about promotions, updates, or new features (with opt-out available)</li>
          </ul>
          <p className="mt-2"><strong>We do not use your information for automated decision-making, profiling, or targeted advertising.</strong> We do not sell your personal information to advertisers or data brokers.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. How We Share Your Information</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Other users:</strong> Hosts see Guest names for bookings; Guests see Host names and listing details. We share only the minimum information necessary to facilitate the transaction</li>
            <li><strong>Service providers:</strong> Stripe (payments), Vercel (hosting), Turso (database), Google (authentication), and Mapbox (mapping). These providers have access to information only as needed to perform their services and are contractually obligated to protect your data</li>
            <li><strong>Legal authorities:</strong> when required by law, subpoena, court order, or to protect the safety of ParkIt, our users, or the public</li>
            <li><strong>Business transfers:</strong> in connection with a merger, acquisition, or sale of assets, your information may be transferred. We will notify you before your information becomes subject to a different privacy policy</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Photo Storage</h2>
          <p>Photos you upload to the Platform (listing photos, booking documentation photos) are stored as part of your account data. Listing photos are visible to all users. Booking photos are visible only to the parties involved in the booking and to ParkIt staff for dispute resolution purposes. You may request deletion of your photos at any time by contacting us.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Data Retention</h2>
          <p>We retain your information for as long as your account is active or as needed to provide services. Specifically:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Account data:</strong> retained until you delete your account</li>
            <li><strong>Transaction records:</strong> retained for 7 years to comply with tax and financial reporting requirements</li>
            <li><strong>Damage claim records:</strong> retained for 3 years from the date of resolution</li>
            <li><strong>Logs and analytics:</strong> retained for 2 years</li>
          </ul>
          <p className="mt-2">If you delete your account, we will remove your personal data within 30 days, except where we are required to retain certain records for legal or legitimate business purposes as described above.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Data Security</h2>
          <p>We implement industry-standard security measures including:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Encryption in transit (TLS/HTTPS) for all data传输</li>
            <li>Secure authentication via Google OAuth</li>
            <li>Access controls on our infrastructure</li>
            <li>Regular security reviews of our dependencies</li>
          </ul>
          <p className="mt-2">However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security. You are responsible for maintaining the security of your account credentials.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Access the personal information we hold about you</li>
            <li>Correct inaccurate or incomplete data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to or restrict certain processing of your data</li>
            <li>Data portability — receive a copy of your data in a portable format</li>
            <li>Withdraw consent where processing is based on consent</li>
          </ul>
          <p className="mt-2">To exercise any of these rights, contact us at support@park-it.net. We will respond within 30 days.</p>
          <p className="mt-2 font-medium text-foreground">Account Deletion:</p>
          <p>You may delete your account at any time by contacting us at support@park-it.net. Upon deletion:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Your personal profile information is removed within 30 days</li>
            <li>Your listings are deactivated</li>
            <li>Your reviews remain visible but are attributed to &quot;Deleted User&quot;</li>
            <li>Transaction records are retained as required by law</li>
          </ul>
          <p className="mt-2">You may also request a copy of all personal data we hold about you by emailing support@park-it.net. We will provide your data in a structured, commonly used, machine-readable format within 30 days.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">8. Cookies and Tracking Technologies</h2>

          <h3 className="text-lg font-medium text-foreground mt-4">Essential Cookies</h3>
          <p>Required for the Platform to function. These cannot be disabled.</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Session cookies for authentication</li>
            <li>Security cookies for fraud prevention</li>
            <li>Load balancing cookies</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4">Functional Cookies</h3>
          <p>Remember your preferences and settings.</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Language and display preferences</li>
            <li>Recent search history</li>
            <li>Map view state</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4">Analytics Cookies</h3>
          <p>Help us understand how the Platform is used.</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Page view statistics</li>
            <li>Feature usage patterns</li>
            <li>Error tracking</li>
          </ul>

          <p className="mt-2">You can manage cookie preferences through the cookie consent banner displayed on your first visit, or at any time by clicking the &quot;Cookie Settings&quot; link in the footer. Disabling non-essential cookies may limit some functionality.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">9. Do Not Sell My Personal Information</h2>
          <p>Under the California Consumer Privacy Act (CCPA) and similar state laws, you have the right to opt out of the &quot;sale&quot; of your personal information. <strong>ParkIt does not sell your personal information to third parties for monetary consideration.</strong> We do not share your data with third parties for their direct marketing purposes.</p>
          <p className="mt-2">However, under the broad CCPA definition of &quot;sale,&quot; certain data sharing with our service providers (Stripe, Google, Mapbox) may qualify. You may submit a Do Not Sell request by emailing support@park-it.net or using the cookie settings tool to opt out of non-essential data sharing.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">10. Third-Party Links</h2>
          <p>The Platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any information.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">11. Children&apos;s Privacy</h2>
          <p>The Platform is not intended for children under 13. We do not knowingly collect information from children under 13. If you believe a child has provided us with personal data, contact us immediately and we will delete it.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">12. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on the Platform, updating the &quot;Last updated&quot; date, and, where required by law, providing at least 14 days&apos; notice before changes take effect. Your continued use after changes take effect constitutes acceptance of the updated policy.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">13. Contact Us</h2>
          <p>For questions about this Privacy Policy, to exercise your data rights, or to submit a Do Not Sell request, contact us at:</p>
          <p className="mt-2">Email: support@park-it.net</p>
        </section>
      </div>
    </div>
  );
}
