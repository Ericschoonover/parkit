import { Metadata } from "next";
import { Shield, Camera, AlertTriangle, CheckCircle, Phone, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Safety - ParkIt",
  description: "Safety guidelines and resources for using ParkIt parking marketplace.",
};

export default function SafetyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Safety</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Your safety is our top priority. Here&apos;s how ParkIt protects you and what you can
        do to stay safe.
      </p>

      <div className="space-y-8">
        {/* For Guests */}
        <section>
          <h2 className="text-xl font-semibold mb-4">For Guests (Parkers)</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-sm">Document Everything</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Take photos of the parking space when you arrive and before you leave.
                This protects you if a damage claim is filed after your booking.
              </p>
            </div>
            <div className="p-4 rounded-xl border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-sm">Check Reviews</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Read reviews from other parkers before booking. Look for notes about
                safety, lighting, and accessibility.
              </p>
            </div>
            <div className="p-4 rounded-xl border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-sm">Use Secure Payment</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Always pay through ParkIt. Never pay cash or send money off-platform.
                Your payment is processed securely through Stripe.
              </p>
            </div>
            <div className="p-4 rounded-xl border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <h3 className="font-medium text-sm">Report Issues</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                If a space is unsafe, inaccessible, or materially different from the
                listing, report it within 24 hours for a full refund.
              </p>
            </div>
          </div>
        </section>

        {/* For Hosts */}
        <section>
          <h2 className="text-xl font-semibold mb-4">For Hosts (Spot Owners)</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-sm">Carry Insurance</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                We require hosts to confirm they have homeowner&apos;s or renter&apos;s insurance
                that covers third-party vehicle parking. Verify with your provider that
                your policy covers this — many standard policies exclude commercial use.
              </p>
            </div>
            <div className="p-4 rounded-xl border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-sm">Photograph Before &amp; After</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Take photos of your space before and after each booking. This is your
                strongest evidence if a damage claim is filed.
              </p>
            </div>
            <div className="p-4 rounded-xl border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-sm">Accurate Listings</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Describe your space honestly — dimensions, clearance, access instructions,
                and any restrictions. Inaccurate listings lead to disputes and refunds.
              </p>
            </div>
            <div className="p-4 rounded-xl border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-sm">Secure Access</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Provide clear access instructions. If your space has a gate or lock,
                share codes only with confirmed renters through the platform.
                Do not post gate codes in public listing descriptions.
              </p>
            </div>
          </div>
        </section>

        {/* Damage Claims */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Damage Claims</h2>
          <div className="prose prose-sm text-muted-foreground">
            <p>
              If your vehicle or property is damaged during a booking, ParkIt has a structured
              dispute resolution process:
            </p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>File a claim within 48 hours of the booking end time</li>
              <li>Include photos and a description of the damage</li>
              <li>The other party has 48 hours to respond with evidence</li>
              <li>ParkIt reviews all evidence and issues a decision within 5 business days</li>
              <li>Either party may appeal within 14 days</li>
            </ol>
            <p className="mt-3">
              See our <a href="/terms" className="underline hover:text-foreground">Terms of Service</a> for
              full details on damage claims, dispute resolution, and liability limitations.
            </p>
          </div>
        </section>

        {/* Emergency */}
        <section className="p-6 rounded-xl bg-red-50 border border-red-200">
          <div className="flex items-center gap-3 mb-3">
            <Phone className="h-5 w-5 text-red-600" />
            <h2 className="text-xl font-semibold text-red-800">Emergency &amp; Reporting</h2>
          </div>
          <div className="space-y-3 text-sm text-red-700">
            <p>
              <strong>If you are in immediate danger, call 911.</strong> ParkIt is not a
              substitute for emergency services.
            </p>
            <p>
              <strong>For theft, vandalism, or property crime:</strong> File a police report
              with your local law enforcement agency. ParkIt is a marketplace and cannot
              investigate criminal activity. Provide your police report number when filing
              a damage claim on the Platform.
            </p>
            <p>
              <strong>For non-emergency safety concerns</strong> about a listing or user,
              contact us at <strong>support@park-it.net</strong>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
