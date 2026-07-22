import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - ParkIt",
  description: "Terms of Service for ParkIt parking marketplace.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: July 22, 2026</p>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>By accessing or using ParkIt (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform. You must be at least 18 years old to use the Platform and have the legal capacity to enter into a binding agreement.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
          <p>ParkIt is an online marketplace that connects parking space owners (&quot;Hosts&quot;) with individuals seeking parking (&quot;Guests&quot;). <strong>ParkIt is not a party to any agreement between Hosts and Guests and does not own, operate, or control any parking spaces listed on the Platform.</strong> All listings are created by users of the Platform. ParkIt does not verify, endorse, or guarantee any listing, and users transact at their own risk.</p>
          <p className="mt-2"><strong>No Employment or Agency Relationship.</strong> Nothing in these Terms creates an employment, agency, partnership, joint venture, or franchise relationship between ParkIt and any user. Hosts are independent service providers, not employees or agents of ParkIt. ParkIt does not direct or control the manner or means by which Hosts provide parking services.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Account Registration</h2>
          <p>You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. You agree to provide accurate and complete information during registration and to keep it updated. ParkIt reserves the right to suspend or terminate accounts that contain false or misleading information.</p>
          <p className="mt-2">ParkIt does not conduct background checks, identity verification, or criminal history checks on any user. Users are solely responsible for assessing the trustworthiness and safety of other users before engaging in any transaction.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Host Responsibilities</h2>
          <p>Hosts who list parking spaces agree to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Accurately describe the parking space, including size, access instructions, and restrictions</li>
            <li>Ensure the space is available and accessible as described during the booked period</li>
            <li>Comply with all applicable local laws, zoning regulations, HOA rules, and landlord restrictions</li>
            <li>Maintain appropriate insurance coverage for their property (see Section 14)</li>
            <li>Not discriminate against any Guest based on race, color, religion, gender, sexual orientation, national origin, disability, or other protected characteristics under applicable federal, state, or local law</li>
            <li>Keep listing information, including pricing and availability, accurate and current</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Guest Responsibilities</h2>
          <p>Guests who book parking spaces agree to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Park only in the designated space and comply with any posted rules or access instructions</li>
            <li>Not damage the Host&apos;s property, surrounding structures, or other vehicles</li>
            <li>Not park vehicles that exceed the dimensions, weight limits, or clearance described in the listing</li>
            <li>Remove their vehicle by the end of the booked period</li>
            <li>Not use the space for any illegal purpose</li>
            <li>Report any damage caused during the booking period immediately (see Section 13)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Bookings and Reservations</h2>
          <p>When a Guest books a parking space, a binding agreement is formed between the Host and Guest for the specified time period. ParkIt facilitates the transaction but is not a party to this agreement.</p>
          <p className="mt-2">Once a booking is confirmed:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>The Host must make the space available as described</li>
            <li>The Guest must park within the booked time window</li>
            <li>Neither party may unilaterally cancel without following the Cancellation Policy (Section 9)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Payments and Payouts</h2>
          <p>All payments are processed through Stripe. By using the Platform, you agree to Stripe&apos;s terms of service.</p>
          <p className="mt-2 font-medium text-foreground">Payment Flow:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Guests pay the total amount at the time of booking, which includes the parking fee, service fee, and refundable damage deposit</li>
            <li><strong>Parking fees are transferred to the Host&apos;s connected Stripe account upon booking confirmation.</strong> ParkIt does not hold parking fees in escrow</li>
            <li><strong>Damage deposits are held on ParkIt&apos;s Stripe platform account</strong> until the booking ends, at which point they are either refunded to the Guest or transferred to the Host (see Section 11)</li>
            <li>Service fees are retained by ParkIt on each transaction</li>
          </ul>
          <p className="mt-2 font-medium text-foreground">Service Fees:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>ParkIt charges a service fee of 15% on each transaction, deducted from the Host&apos;s parking payout</li>
            <li>Guests see the total price including all fees at checkout</li>
            <li>Service fees are non-refundable once a booking is confirmed, except when ParkIt cancels the booking</li>
          </ul>
          <p className="mt-2 font-medium text-foreground">Refunds:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Full refund if the Host cancels or the space is materially different from the listing description</li>
            <li>Full refund if the Guest cancels at least 24 hours before the booking start time</li>
            <li>50% refund of the parking fee (excluding service fee) for cancellations within 24 hours of the booking start time</li>
            <li>Full damage deposit refund upon cancellation, regardless of timing</li>
            <li>No refund for no-shows (Guest does not arrive within 1 hour of booking start time)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">8. Cancellations</h2>
          <p>Cancellation policies are enforced automatically by the Platform. The following policies apply to all bookings:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Guest cancels 24+ hours before start:</strong> Full refund of parking fee and deposit</li>
            <li><strong>Guest cancels less than 24 hours before start:</strong> 50% refund of parking fee (service fee non-refundable); full deposit refund</li>
            <li><strong>No-show (Guest):</strong> No refund of parking fee or service fee; deposit is refunded</li>
            <li><strong>Host cancels:</strong> Full refund to Guest of all amounts including service fee; Host may face account penalties including reduced search ranking or suspension</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">9. Apple Pay and Google Pay</h2>
          <p>The Platform supports Apple Pay and Google Pay as payment methods. These payment methods are processed through Stripe and are subject to Apple&apos;s and Google&apos;s respective terms of service. ParkIt does not store your Apple Pay or Google Pay credentials.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">10. Tax Obligations</h2>
          <p className="font-medium text-foreground">For Hosts:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>You are solely responsible for reporting all income received through the Platform to the IRS and applicable state tax authorities</li>
            <li>ParkIt may issue IRS Form 1099-K to Hosts who receive $600 or more in gross payments in a calendar year, as required by federal law</li>
            <li>You agree to provide accurate tax identification information (W-9 form) when requested by ParkIt</li>
            <li>ParkIt does not provide tax advice. Consult a qualified tax professional regarding your tax obligations</li>
          </ul>
          <p className="mt-2 font-medium text-foreground">Sales Tax:</p>
          <p>ParkIt may be required to collect and remit sales tax on service fees in certain states. Any applicable sales tax will be displayed at checkout.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">11. Damage Deposit</h2>
          <p>To protect both Hosts and Guests, ParkIt collects a refundable damage deposit for each booking.</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>The deposit amount is set by the Host and displayed before the Guest confirms the booking (default: $50, maximum: $500)</li>
            <li>The deposit is charged at the time of booking and held on ParkIt&apos;s platform</li>
            <li><strong>After the booking ends, the deposit is automatically refunded to the Guest within 24 hours</strong> unless the Host initiates a damage claim</li>
            <li>If a Host initiates a damage claim (see Section 13), the deposit is held until the claim is resolved through the dispute resolution process</li>
            <li>Damage deposits are separate from the parking fee and are not transferred to the Host unless a valid damage claim is approved</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">12. Photo Documentation</h2>
          <p>To support fair dispute resolution, ParkIt strongly recommends that both Hosts and Guests document the condition of the parking space with photos:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Hosts:</strong> Take photos of the space before and after each booking to document its condition</li>
            <li><strong>Guests:</strong> Take photos upon arrival and before departure to document the space and any pre-existing damage</li>
            <li>Photos should clearly show the parking space and any relevant damage or conditions</li>
            <li>Photos may be submitted as evidence in any damage dispute</li>
          </ul>
          <p className="mt-2">Failure to provide photo documentation may weaken a party&apos;s position in a dispute, but does not automatically bar a claim.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">13. Damage Claims and Dispute Resolution</h2>
          <p className="font-medium text-foreground">Filing a Claim:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Either party may file a damage claim within 48 hours of the booking end time</li>
            <li>Claims must include a description of the damage and supporting photo evidence</li>
            <li>Claims are submitted through the Platform&apos;s dispute resolution system</li>
          </ul>
          <p className="mt-2 font-medium text-foreground">Resolution Process:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Step 1 — Claim Filed:</strong> The claiming party submits a description and photo evidence of the damage through the Platform</li>
            <li><strong>Step 2 — Response Period (48 hours):</strong> The responding party is notified and has 48 hours to respond with their own evidence, including photos, receipts, or other documentation</li>
            <li><strong>Step 3 — Evidence Review:</strong> Both parties may submit additional evidence. ParkIt reviews all submitted evidence</li>
            <li><strong>Step 4 — Decision:</strong> ParkIt issues a decision within 5 business days of receiving all evidence. Decisions may include full deposit transfer to Host, full deposit refund to Guest, or partial resolution</li>
            <li><strong>Step 5 — Appeal:</strong> Either party may appeal a decision within 14 days by providing additional evidence not previously submitted. Appeals are reviewed by a different member of the ParkIt team. The appeal decision is final</li>
          </ul>
          <p className="mt-2 font-medium text-foreground">Claim Limits:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Damage claims through the Platform are capped at the damage deposit amount</li>
            <li>Damage exceeding the deposit amount must be pursued directly between the parties or through small claims court</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">14. Insurance Recommendations</h2>
          <p><strong>ParkIt is not an insurer and does not provide insurance coverage for any booking.</strong> The checkbox during listing creation is the Host&apos;s personal attestation of insurance coverage. ParkIt does not verify, confirm, or guarantee that any Host maintains insurance coverage.</p>
          <p className="mt-2 font-medium text-foreground">For Hosts:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>You are solely responsible for maintaining adequate insurance coverage for your property</li>
            <li>Homeowner&apos;s or renter&apos;s insurance may cover property damage that occurs on your premises, but many policies exclude commercial use or third-party vehicle parking</li>
            <li>Verify with your insurance provider that your policy covers third-party vehicle parking on your property</li>
            <li>Consider a commercial liability policy or umbrella policy for additional protection</li>
            <li>Failure to maintain adequate insurance may expose you to personal liability for property damage or injuries occurring at your listed location</li>
          </ul>
          <p className="mt-2 font-medium text-foreground">For Guests:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Your auto insurance may cover damage to your vehicle while parked at a third-party location</li>
            <li>Comprehensive auto insurance typically covers theft, vandalism, and non-collision damage</li>
            <li>ParkIt is not responsible for damage to your vehicle and does not provide vehicle insurance</li>
          </ul>
          <p className="mt-2">ParkIt may offer optional protection plans in the future through third-party insurance partners, but no such plans are currently available.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">15. Accessibility</h2>
          <p>ParkIt does not verify ADA compliance of any listing. Hosts who mark a listing as &quot;Accessible&quot; are representing that the space meets their understanding of accessibility requirements. Guests with disabilities should contact the Host directly to confirm that the space meets their specific accessibility needs before booking. ParkIt is not responsible for inaccurate accessibility representations in listings.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">16. Boat Slip, RV, and Long-Term Storage — Additional Terms</h2>
          <p className="font-medium text-foreground">Boat Slips and Watercraft Parking:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Marina Authority:</strong> Hosts listing boat slips or watercraft parking warrant that they have the legal right to sublease or rent the slip, including any required marina authorization, lease permission, or harbormaster approval. listing without proper authority is a violation of these Terms and may result in immediate account termination</li>
            <li><strong>Water Damage and Flood Risk:</strong> ParkIt does not guarantee that any boat slip or watercraft parking area is safe from water damage, flooding, storm surge, tidal changes, or rising water levels. Guests are solely responsible for assessing flood risk and obtaining appropriate marine or watercraft insurance</li>
            <li><strong>Coast Guard and Regulatory Compliance:</strong> Hosts and Guests are responsible for complying with all U.S. Coast Guard regulations, state boating laws, marina rules, and environmental regulations. ParkIt is not responsible for any fines, penalties, or enforcement actions resulting from non-compliance</li>
            <li><strong>No Boat Insurance Provided:</strong> ParkIt does not provide marine insurance, hull coverage, or liability coverage for watercraft. Guests must maintain their own boat insurance. The damage deposit applies to property damage only and does not cover sinkage, submersion, or total loss of a watercraft</li>
            <li><strong>Mooring and Docking:</strong> Hosts are responsible for ensuring the slip is properly maintained, including cleats, pilings, dock lines, and electrical shore power connections. Guests are responsible for properly mooring their watercraft and confirming that the slip is suitable for their vessel&apos;s size and weight</li>
          </ul>

          <p className="font-medium text-foreground mt-4">RV and Trailer Parking:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Hookup Liability:</strong> If a listing includes electrical, water, sewer, or other utility hookups, the Host is responsible for ensuring these connections are safe, properly installed, and compliant with local codes. ParkIt is not liable for property damage, fire, water damage, or injury resulting from faulty hookups. Guests use hookups at their own risk</li>
            <li><strong>Oversized Vehicle Risk:</strong> RVs, trailers, and campers may cause damage to driveways, landscaping, underground utilities, overhanging structures, and neighboring properties due to their weight, height, and turning radius. Guests are responsible for all damage caused by maneuvering oversized vehicles and should verify clearance, weight limits, and surface capacity before booking</li>
            <li><strong>DOT and Road Compliance:</strong> Guests are solely responsible for ensuring their RV, trailer, or oversized vehicle complies with all Department of Transportation requirements, including registration, lighting, weight limits, and towing laws. ParkIt is not responsible for any DOT violations or fines</li>
            <li><strong>Utility Costs:</strong> If a listing includes hookups, any utility costs (electric, water, sewer) exceeding normal usage may be billed to the Guest by the Host outside the Platform. ParkIt does not facilitate or guarantee payment for utility overages</li>
          </ul>

          <p className="font-medium text-foreground mt-4">Long-Term Storage (30+ Days):</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Bailment:</strong> When a Guest stores a vehicle or property at a Host&apos;s location for 30 or more consecutive days, a bailment relationship may arise under applicable state law. This may impose a higher duty of care on the Host than short-term parking. Hosts offering long-term storage should consult with a legal professional regarding their obligations as bailees</li>
            <li><strong>Abandoned Vehicle:</strong> If a Guest&apos;s vehicle remains at the Host&apos;s location beyond the booked period without extension, the Host may be subject to state and local abandoned vehicle laws. ParkIt is not responsible for towing, storage fees, or disposal of abandoned vehicles. Hosts should follow their jurisdiction&apos;s legal process for abandoned property</li>
            <li><strong>Property Stored at Owner&apos;s Risk:</strong> Except to the extent imposed by law, Hosts are not responsible for damage to vehicles or property stored at their location due to natural causes (weather, animals, tree fall), theft, vandalism, or other events beyond the Host&apos;s control. Guests should maintain comprehensive insurance coverage for long-term storage</li>
            <li><strong>Access and Inspection:</strong> For long-term storage bookings, Guests should clarify with the Host whether periodic access or inspection of the stored vehicle is permitted. ParkIt does not guarantee access rights beyond what is described in the listing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">16. Limitation of Liability</h2>
          <p><strong>To the maximum extent permitted by law, ParkIt, its officers, directors, employees, and agents shall not be liable for:</strong></p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>The safety, security, or condition of any parking space</li>
            <li>Damage to vehicles or property, including theft, vandalism, or loss of any kind</li>
            <li>Injuries to persons or vehicles while using a parking space, including death</li>
            <li>Disputes between Hosts and Guests</li>
            <li>The accuracy of listing information provided by Hosts</li>
            <li>Any actions or omissions of Hosts or Guests</li>
            <li>Any indirect, incidental, special, consequential, or punitive damages</li>
          </ul>
          <p className="mt-2">ParkIt&apos;s total liability to you for all claims arising out of or relating to the use of or inability to use the Platform shall not exceed the greater of (a) the amount of service fees you paid to ParkIt in the twelve (12) months preceding the claim, or (b) $100.</p>
          <p className="mt-2">Some states do not allow the exclusion or limitation of incidental or consequential damages, so the above limitation or exclusion may not apply to you.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">17. Disclaimer of Warranties</h2>
          <p><strong>THE PLATFORM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.</strong> To the fullest extent permitted by law, ParkIt disclaims all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
          <p className="mt-2">ParkIt does not warrant that:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>The Platform will be uninterrupted, secure, or error-free</li>
            <li>Listing information is accurate, complete, or current</li>
            <li>Any parking space meets your requirements or expectations</li>
            <li>Any parking space is safe, lawful, or accessible</li>
            <li>Transactions between Hosts and Guests will be completed successfully</li>
          </ul>
          <p className="mt-2"><strong>Listings are provided by Hosts, not ParkIt. ParkIt does not inspect, verify, or guarantee any listing.</strong> You are solely responsible for evaluating whether a listing meets your needs before booking.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">18. Indemnification</h2>
          <p>You agree to indemnify, defend, and hold harmless ParkIt, its officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys&apos; fees) arising from or relating to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Your use of the Platform</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any applicable law or regulation</li>
            <li>Your interactions with other users</li>
            <li>Any property damage, personal injury, or death arising from a booking you created, facilitated, or participated in</li>
            <li>Any misrepresentation in your listing or booking information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">19. Prohibited Conduct</h2>
          <p>You may not:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Use the Platform for any unlawful purpose</li>
            <li>Attempt to circumvent ParkIt&apos;s payment system or communicate off-platform to avoid fees</li>
            <li>Create fake listings or provide false information</li>
            <li>Harass, threaten, abuse, or harm other users</li>
            <li>Use automated tools to access the Platform</li>
            <li>Interfere with the Platform&apos;s operation or security</li>
            <li>Discriminate against any user based on protected characteristics</li>
            <li>List a parking space that you do not have the legal right to rent</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">20. User Disputes</h2>
          <p><strong>ParkIt is not a party to any dispute between users.</strong> You are solely responsible for your interactions with other users, both on and off the Platform. ParkIt has no obligation to mediate, arbitrate, or resolve any dispute between users, except as expressly set forth in these Terms regarding damage deposit claims processed through the Platform.</p>
          <p className="mt-2">If you have a dispute with another user, you release ParkIt from any claims, demands, and damages of every kind and nature, known and unknown, arising out of or in any way connected with such disputes. If you are a California resident, you waive California Civil Code Section 1542, which says: &quot;A general release does not extend to claims that the creditor or releasing party does not know or suspect to exist in his or her favor at the time of executing the release.&quot;</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">21. Intellectual Property</h2>
          <p>All content, trademarks, logos, and intellectual property on the Platform are owned by or licensed to ParkIt. You may not copy, modify, distribute, or reverse-engineer any part of the Platform without written permission.</p>
          <p className="mt-2">Users retain ownership of content they upload to the Platform (photos, descriptions, reviews). By uploading content, you grant ParkIt a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content in connection with operating the Platform.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">22. User-Generated Content and Moderation</h2>
          <p>ParkIt hosts user-generated content including listings, reviews, and photos. We are not obligated to monitor all content, but we reserve the right to remove content that violates these Terms.</p>
          <p className="mt-2">If you believe content on the Platform infringes your copyright, you may submit a DMCA takedown notice to our designated agent at <strong>support@park-it.net</strong> with: (1) identification of the copyrighted work, (2) identification of the infringing material, (3) your contact information, (4) a statement of good faith belief, and (5) your physical or electronic signature.</p>
          <p className="mt-2">Reviews are user-generated content and do not represent the views of ParkIt. ParkIt does not guarantee the accuracy of reviews and is not liable for defamatory or false statements in reviews. You may flag reviews that violate our policies for review.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">23. Termination</h2>
          <p>ParkIt reserves the right to suspend or terminate your account at any time for any reason, including violation of these Terms. You may also close your account at any time by contacting us. Upon termination, any pending payouts will be processed, any pending disputes will be resolved, and these Terms remain in effect.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">24. Governing Law</h2>
          <p>These Terms are governed by the laws of the State of Michigan, without regard to its conflict of law provisions. If Michigan law cannot be applied to a dispute, the laws of the state where the parking spot is located shall apply.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">25. Dispute Resolution and Binding Arbitration</h2>
          <p className="font-medium text-foreground">Mandatory Arbitration:</p>
          <p>You and ParkIt agree that any dispute, claim, or controversy arising out of or relating to these Terms or the Platform shall be resolved exclusively through binding arbitration, rather than in court, except that either party may bring an individual action in small claims court for disputes within the court&apos;s jurisdiction.</p>
          <p className="mt-2 font-medium text-foreground">Class Action Waiver:</p>
          <p><strong>YOU AND PARKIT AGREE THAT EACH PARTY MAY BRING DISPUTES AGAINST THE OTHER ONLY IN AN INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, CONSOLIDATED, OR REPRESENTATIVE PROCEEDING.</strong> This includes any class action lawsuit, class arbitration, or collective proceeding.</p>
          <p className="mt-2 font-medium text-foreground">Jury Trial Waiver:</p>
          <p><strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, YOU AND PARKIT EACH WAIVE ANY RIGHT TO A TRIAL BY JURY</strong> in any legal proceeding arising out of or relating to these Terms or the Platform.</p>
          <p className="mt-2 font-medium text-foreground">Arbitration Rules:</p>
          <p>Arbitration shall be conducted in accordance with the rules of the American Arbitration Association (&quot;AAA&quot;). The arbitration shall be conducted by a single arbitrator. The arbitration shall take place in Michigan, unless the parties agree otherwise. The arbitrator&apos;s decision is final and binding, and judgment on the award may be entered in any court of competent jurisdiction.</p>
          <p className="mt-2 font-medium text-foreground">Opt-Out:</p>
          <p>You may opt out of the arbitration and class action waiver provisions by sending written notice to ParkIt at support@park-it.net within 30 days of your first use of the Platform. The notice must include your name, email address, and a statement that you wish to opt out. Opting out does not affect your other obligations under these Terms.</p>
          <p className="mt-2">This arbitration agreement survives the termination of your account and these Terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">26. Force Majeure</h2>
          <p>ParkIt shall not be liable for any failure or delay in performing our obligations under these Terms where such failure or delay results from any cause beyond our reasonable control, including but not limited to: acts of God, natural disasters, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, earthquakes, pandemics, epidemics, government actions, labor disputes, power or telecommunications failures, or Internet disruptions. In such event, our obligations under these Terms will be suspended for the duration of the force majeure event.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">27. Severability</h2>
          <p>If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full force and effect.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">28. Entire Agreement</h2>
          <p>These Terms, together with our Privacy Policy, constitute the entire agreement between you and ParkIt regarding the use of the Platform and supersede all prior agreements and understandings.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">29. Changes to Terms</h2>
          <p>ParkIt may update these Terms at any time. We will notify you of material changes by posting the updated Terms on the Platform and, where required, by email at least 14 days before changes take effect. Your continued use after changes take effect constitutes acceptance of the updated Terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">30. Contact</h2>
          <p>For questions about these Terms, contact us at support@park-it.net.</p>
        </section>
      </div>
    </div>
  );
}
