import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA Policy - ParkIt",
  description: "DMCA takedown policy for ParkIt parking marketplace.",
};

export default function DMCAPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">DMCA Takedown Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: July 22, 2026</p>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <section>
          <p>ParkIt respects the intellectual property rights of others and expects our users to do the same. In accordance with the Digital Millennium Copyright Act of 1998 (&quot;DMCA&quot;), we will respond expeditiously to claims of copyright infringement that are reported to our designated copyright agent.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Filing a DMCA Takedown Notice</h2>
          <p>If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible on the ParkIt platform, please notify our designated copyright agent. For your complaint to be valid under the DMCA, you must provide the following information in writing:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>A physical or electronic signature of a person authorized to act on behalf of the copyright owner</li>
            <li>Identification of the copyrighted work claimed to have been infringed</li>
            <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity, and information reasonably sufficient to permit us to locate the material (e.g., the URL of the listing or photo)</li>
            <li>Your contact information, including your address, telephone number, and email address</li>
            <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law</li>
            <li>A statement, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or are authorized to act on behalf of the copyright owner</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">How to Submit a Notice</h2>
          <p>Send your DMCA takedown notice to our designated agent at:</p>
          <p className="mt-2 font-medium text-foreground">Email: support@park-it.net</p>
          <p className="mt-2">Please include &quot;DMCA Takedown Request&quot; in the subject line of your email.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Counter-Notification</h2>
          <p>If you believe your content was removed or disabled by mistake or misidentification, you may file a counter-notification with us. Your counter-notification must include:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Your physical or electronic signature</li>
            <li>Identification of the content that was removed and the location where it appeared before removal</li>
            <li>A statement under penalty of perjury that you have a good faith belief that the content was removed as a result of mistake or misidentification</li>
            <li>Your name, address, and telephone number, and a statement that you consent to the jurisdiction of the federal court in Michigan and that you will accept service of process from the person who filed the original DMCA notice</li>
          </ul>
          <p className="mt-2">Counter-notifications should be sent to support@park-it.net with &quot;DMCA Counter-Notification&quot; in the subject line.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Repeat Infringers</h2>
          <p>ParkIt maintains a policy of terminating the accounts of users who are identified as repeat infringers. A repeat infringer is a user who has been notified of infringing activity more than twice or has had content removed more than twice.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Good Faith Believers</h2>
          <p>Please note that under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material or activity is infringing may be subject to liability.</p>
        </section>
      </div>
    </div>
  );
}
