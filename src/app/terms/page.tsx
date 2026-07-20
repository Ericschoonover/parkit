import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - ParkIt",
  description: "Terms of Service for ParkIt parking marketplace.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: July 20, 2026</p>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>By accessing or using ParkIt (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
          <p>ParkIt is an online marketplace that connects parking space owners (&quot;Hosts&quot;) with individuals seeking parking (&quot;Guests&quot;). ParkIt is not a party to any agreement between Hosts and Guests and does not own, operate, or control any parking spaces listed on the Platform.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Eligibility</h2>
          <p>You must be at least 18 years old to use the Platform. By using ParkIt, you represent and warrant that you meet this requirement and have the legal capacity to enter into a binding agreement.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Account Registration</h2>
          <p>To use certain features, you must create an account. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. You agree to provide accurate and complete information during registration and to keep it updated.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Host Responsibilities</h2>
          <p>Hosts who list parking spaces agree to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Accurately describe the parking space, including size, access instructions, and restrictions</li>
            <li>Ensure the space is available and accessible as described during the booked period</li>
            <li>Comply with all applicable local laws, zoning regulations, and HOA rules</li>
            <li>Maintain appropriate insurance coverage for their property (see Section 14)</li>
            <li>Not discriminate against any Guest based on race, religion, gender, national origin, disability, or other protected characteristics</li>
            <li>Respond to Guest inquiries and booking requests in a timely manner</li>
            <li>Keep listing information, including pricing and availability, accurate and current</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Guest Responsibilities</h2>
          <p>Guests who book parking spaces agree to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Park only in the designated space and comply with any posted rules or access instructions</li>
            <li>Not damage the Host&apos;s property, surrounding structures, or other vehicles</li>
            <li>Not park vehicles that exceed the dimensions, weight limits, or clearance described in the listing</li>
            <li>Remove their vehicle by the end of the booked period</li>
            <li>Not use the space for any illegal purpose</li>
            <li>Report any damage caused during the booking period immediately (see Section 12)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Bookings and Reservations</h2>
          <p>When a Guest books a parking space, a binding agreement is formed between the Host and Guest for the specified time period. ParkIt facilitates the transaction but is not a party to this agreement.</p>
          <p className="mt-2">Once a booking is confirmed:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>The Host must make the space available as described</li>
            <li>The Guest must park within the booked time window</li>
            <li>Neither party may unilaterally cancel without following the Cancellation Policy (Section 9)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">8. Payments, Escrow, and Payouts</h2>
          <p>All payments are processed through Stripe. By using the Platform, you agree to Stripe&apos;s terms of service.</p>
          <p className="mt-2 font-medium text-foreground">Escrow Hold:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Guest payments are held in escrow by ParkIt and are not released to the Host until the booking period has ended</li>
            <li>Funds are released to the Host within 24–48 hours after the booking end time, provided no dispute has been filed</li>
            <li>If a dispute is filed, funds are held until the dispute is resolved (see Section 12)</li>
          </ul>
          <p className="mt-2 font-medium text-foreground">Service Fees:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>ParkIt charges a service fee of 15% on each transaction, deducted from the Host&apos;s payout</li>
            <li>Guests see the total price including all fees at checkout</li>
          </ul>
          <p className="mt-2 font-medium text-foreground">Refunds:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Full refund if the Host cancels or the space is unavailable as described</li>
            <li>Full refund if the Guest cancels at least 24 hours before the booking start time</li>
            <li>Partial or no refund for cancellations within 24 hours of the booking start time, at the Host&apos;s discretion</li>
            <li>Full refund if the Guest can demonstrate the space was materially different from the listing description</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">9. Cancellations</h2>
          <p>Cancellation policies may vary by listing. Unless otherwise specified by the Host:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Guest cancels 24+ hours before start:</strong> Full refund</li>
            <li><strong>Guest cancels less than 24 hours before start:</strong> Partial refund or credit at Host&apos;s discretion</li>
            <li><strong>Host cancels:</strong> Full refund to Guest, and Host may face account penalties</li>
            <li><strong>No-show (Guest):</strong> No refund; booking is marked as completed</li>
            <li><strong>No-show (Host):</strong> Full refund to Guest; Host&apos;s payout is reversed</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">10. Damage Deposit</h2>
          <p>To protect both Hosts and Guests, ParkIt may require a refundable damage deposit for certain bookings.</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>A hold may be placed on the Guest&apos;s payment method at the time of booking</li>
            <li>The deposit amount will be clearly displayed before the Guest confirms the booking</li>
            <li>The deposit is released automatically within 24 hours after the booking ends, provided no damage claim is filed</li>
            <li>If a Host files a damage claim (see Section 12), the deposit is held until the claim is resolved</li>
            <li>Damage deposits are separate from the parking fee and are not charged unless a valid claim is made</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">11. Photo Documentation</h2>
          <p>To support fair dispute resolution, ParkIt strongly recommends that both Hosts and Guests document the condition of the parking space with photos:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Hosts:</strong> Take photos of the space before and after each booking to document its condition</li>
            <li><strong>Guests:</strong> Take photos upon arrival and before departure to document the space and any pre-existing damage</li>
            <li>Photos should be timestamped and clearly show the parking space and any relevant damage or conditions</li>
            <li>Photos may be submitted as evidence in any damage dispute</li>
          </ul>
          <p className="mt-2">Failure to provide photo documentation may weaken a party&apos;s position in a dispute, but does not automatically bar a claim.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">12. Damage Claims and Dispute Resolution</h2>
          <p className="font-medium text-foreground">Filing a Claim:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Either party may file a damage claim within 24 hours of the booking end time</li>
            <li>Claims must include a description of the damage and supporting photo evidence</li>
            <li>Claims are submitted through the Platform&apos;s dispute resolution system</li>
          </ul>
          <p className="mt-2 font-medium text-foreground">Resolution Process:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Step 1 — Notification:</strong> Both parties are notified of the claim and have 48 hours to respond</li>
            <li><strong>Step 2 — Evidence Review:</strong> Both parties may submit additional evidence (photos, messages, receipts)</li>
            <li><strong>Step 3 — Mediation:</strong> ParkIt reviews all evidence and attempts to facilitate a fair resolution</li>
            <li><strong>Step 4 — Decision:</strong> ParkIt issues a decision within 5 business days of receiving all evidence. Decisions may include full refund to Guest, partial payout to Host, or release of escrow funds</li>
          </ul>
          <p className="mt-2 font-medium text-foreground">Claim Limits:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Damage claims are capped at the booking amount plus the damage deposit</li>
            <li>Claims exceeding this amount must be pursued directly between the parties or through small claims court</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">13. Limitation of Liability</h2>
          <p>ParkIt is a marketplace platform and is not liable for:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>The safety, security, or condition of any parking space</li>
            <li>Damage to vehicles or property, including theft, vandalism, or loss of any kind</li>
            <li>Injuries to persons or vehicles while using a parking space</li>
            <li>Disputes between Hosts and Guests</li>
            <li>The accuracy of listing information provided by Hosts</li>
            <li>Any actions or omissions of Hosts or Guests</li>
          </ul>
          <p className="mt-2">To the maximum extent permitted by law, ParkIt&apos;s total liability shall not exceed the amount of service fees paid by you in the twelve (12) months preceding the claim.</p>
          <p className="mt-2">ParkIt does not provide insurance. Hosts are solely responsible for maintaining adequate insurance coverage for their property. Guests are solely responsible for insuring their vehicles.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">14. Insurance Recommendations</h2>
          <p>ParkIt strongly recommends that all users maintain appropriate insurance coverage:</p>
          <p className="mt-2 font-medium text-foreground">For Hosts:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Homeowner&apos;s or renter&apos;s insurance may cover property damage that occurs on your premises</li>
            <li>Verify with your insurance provider that your policy covers third-party vehicle parking on your property</li>
            <li>Consider a commercial liability policy or umbrella policy for additional protection</li>
            <li>ParkIt may offer optional protection plans in the future through third-party insurance partners</li>
          </ul>
          <p className="mt-2 font-medium text-foreground">For Guests:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Your auto insurance may cover damage to your vehicle while parked at a third-party location</li>
            <li>Comprehensive auto insurance typically covers theft, vandalism, and non-collision damage</li>
            <li>ParkIt is not responsible for damage to your vehicle and does not provide vehicle insurance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">15. Indemnification</h2>
          <p>You agree to indemnify, defend, and hold harmless ParkIt, its officers, directors, employees, and agents from any claims, liabilities, damages, or expenses arising from your use of the Platform, your violation of these Terms, or your interactions with other users.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">16. Prohibited Conduct</h2>
          <p>You may not:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Use the Platform for any unlawful purpose</li>
            <li>Attempt to circumvent ParkIt&apos;s payment system or communicate off-platform to avoid fees</li>
            <li>Create fake listings or provide false information</li>
            <li>Harass, threaten, or abuse other users</li>
            <li>Use automated tools to access the Platform</li>
            <li>Interfere with the Platform&apos;s operation or security</li>
            <li>Discriminate against any user based on protected characteristics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">17. Intellectual Property</h2>
          <p>All content, trademarks, logos, and intellectual property on the Platform are owned by or licensed to ParkIt. You may not copy, modify, distribute, or reverse-engineer any part of the Platform without written permission.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">18. Termination</h2>
          <p>ParkIt reserves the right to suspend or terminate your account at any time for any reason, including violation of these Terms. You may also close your account at any time by contacting us. Upon termination, any pending payouts will be processed, and any pending disputes will be resolved.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">19. Governing Law</h2>
          <p>These Terms are governed by the laws of the State of Michigan, without regard to its conflict of law provisions.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">20. Dispute Resolution</h2>
          <p>Any disputes arising from these Terms that cannot be resolved through ParkIt&apos;s internal dispute resolution process (Section 12) shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, unless you opt out within 30 days of account creation. The arbitration shall be conducted in Michigan.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">21. Changes to Terms</h2>
          <p>ParkIt may update these Terms at any time. We will notify you of material changes by posting the updated Terms on the Platform and, where required, by email. Your continued use after changes take effect constitutes acceptance of the updated Terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">22. Severability</h2>
          <p>If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full force and effect.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">23. Entire Agreement</h2>
          <p>These Terms, together with our Privacy Policy, constitute the entire agreement between you and ParkIt regarding the use of the Platform.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">24. Contact</h2>
          <p>For questions about these Terms, contact us at support@park-it.net.</p>
        </section>
      </div>
    </div>
  );
}
