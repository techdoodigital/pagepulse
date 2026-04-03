import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | PagePulse",
  description: "Privacy Policy for PagePulse",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="prose prose-invert prose-slate max-w-none">
      <h1 className="text-3xl font-bold text-slate-100 mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-slate-500 mb-12">
        Last updated: March 2026
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-200 mb-3">
          1. Information We Collect
        </h2>
        <p className="text-slate-400 leading-relaxed mb-3">
          We collect information that you provide directly to us, as well as
          information generated through your use of the Service. This includes:
        </p>
        <ul className="list-disc list-inside text-slate-400 space-y-1.5 ml-2">
          <li>
            <strong className="text-slate-300">Account information:</strong>{" "}
            name, email address, and password when you create an account
          </li>
          <li>
            <strong className="text-slate-300">Billing information:</strong>{" "}
            payment details processed securely through Stripe (we do not store
            your full credit card number)
          </li>
          <li>
            <strong className="text-slate-300">Content data:</strong> URLs and
            web page content you submit for analysis
          </li>
          <li>
            <strong className="text-slate-300">Usage data:</strong> information
            about how you interact with the Service, including audit history,
            features used, and session data
          </li>
          <li>
            <strong className="text-slate-300">Device information:</strong>{" "}
            browser type, operating system, IP address, and device identifiers
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-200 mb-3">
          2. How We Use Your Information
        </h2>
        <p className="text-slate-400 leading-relaxed mb-3">
          We use the information we collect to:
        </p>
        <ul className="list-disc list-inside text-slate-400 space-y-1.5 ml-2">
          <li>Provide, maintain, and improve the Service</li>
          <li>Process your content audits and generate reports</li>
          <li>Process payments and manage your subscription</li>
          <li>
            Send you transactional emails, service updates, and security alerts
          </li>
          <li>Respond to your support requests and inquiries</li>
          <li>
            Analyze usage patterns to improve Service performance and user
            experience
          </li>
          <li>
            Detect, prevent, and address technical issues or fraudulent
            activity
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-200 mb-3">
          3. Data Storage &amp; Security
        </h2>
        <p className="text-slate-400 leading-relaxed">
          We implement industry-standard security measures to protect your
          personal information from unauthorized access, alteration, disclosure,
          or destruction. Your data is stored on secure servers and transmitted
          using encryption (TLS/SSL). While we strive to protect your
          information, no method of transmission over the Internet or method of
          electronic storage is 100% secure. We cannot guarantee absolute
          security, but we are committed to following best practices to
          safeguard your data.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-200 mb-3">
          4. Third-Party Services
        </h2>
        <p className="text-slate-400 leading-relaxed mb-3">
          We use the following third-party services to operate and improve
          PagePulse. Each service may collect and process data according to their
          own privacy policies:
        </p>
        <ul className="list-disc list-inside text-slate-400 space-y-1.5 ml-2">
          <li>
            <strong className="text-slate-300">OpenAI API:</strong> We send
            content data to OpenAI for AI-powered analysis and scoring. Content
            is processed according to OpenAI&apos;s data usage policies and is not
            used to train their models via API.
          </li>
          <li>
            <strong className="text-slate-300">Stripe:</strong> Handles all
            payment processing. We do not store your full payment card details
            on our servers. Stripe&apos;s privacy policy governs their handling of
            your billing information.
          </li>
          <li>
            <strong className="text-slate-300">Jina Reader:</strong> Used to
            fetch and parse web page content for analysis. URLs you submit may
            be processed through Jina&apos;s infrastructure.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-200 mb-3">
          5. Cookies
        </h2>
        <p className="text-slate-400 leading-relaxed">
          We use cookies and similar tracking technologies to maintain your
          session, remember your preferences, and analyze Service usage.
          Essential cookies are required for the Service to function and cannot
          be disabled. Analytics cookies help us understand how the Service is
          used and may be managed through your browser settings. We do not use
          cookies for third-party advertising. By using the Service, you
          consent to the use of essential cookies.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-200 mb-3">
          6. Your Rights
        </h2>
        <p className="text-slate-400 leading-relaxed mb-3">
          Depending on your jurisdiction, you may have the following rights
          regarding your personal information:
        </p>
        <ul className="list-disc list-inside text-slate-400 space-y-1.5 ml-2">
          <li>
            <strong className="text-slate-300">Access:</strong> Request a copy
            of the personal data we hold about you
          </li>
          <li>
            <strong className="text-slate-300">Correction:</strong> Request
            correction of inaccurate or incomplete data
          </li>
          <li>
            <strong className="text-slate-300">Deletion:</strong> Request
            deletion of your personal data, subject to legal retention
            requirements
          </li>
          <li>
            <strong className="text-slate-300">Portability:</strong> Request
            your data in a structured, machine-readable format
          </li>
          <li>
            <strong className="text-slate-300">Objection:</strong> Object to
            certain types of data processing
          </li>
        </ul>
        <p className="text-slate-400 leading-relaxed mt-3">
          To exercise any of these rights, please contact us at{" "}
          <a
            href="mailto:support@pagepulse.co"
            className="text-teal-400 hover:text-teal-300 transition"
          >
            support@pagepulse.co
          </a>
          . We will respond to your request within 30 days.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-200 mb-3">
          7. Data Retention
        </h2>
        <p className="text-slate-400 leading-relaxed">
          We retain your personal information for as long as your account is
          active or as needed to provide the Service. Audit results and reports
          are retained for the duration of your subscription. When you delete
          your account, we will delete or anonymize your personal data within
          30 days, except where we are required by law to retain certain
          information. Aggregated, anonymized data that cannot be used to
          identify you may be retained indefinitely for analytics and product
          improvement purposes.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-200 mb-3">
          8. Changes to This Policy
        </h2>
        <p className="text-slate-400 leading-relaxed">
          We may update this Privacy Policy from time to time. When we make
          material changes, we will update the &quot;Last updated&quot; date at the top
          of this page and notify you via email or through the Service where
          appropriate. We encourage you to review this Privacy Policy
          periodically. Your continued use of the Service after changes are
          posted constitutes your acceptance of the updated policy.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-200 mb-3">
          9. Contact
        </h2>
        <p className="text-slate-400 leading-relaxed">
          If you have any questions or concerns about this Privacy Policy or
          our data practices, please contact us at{" "}
          <a
            href="mailto:support@pagepulse.co"
            className="text-teal-400 hover:text-teal-300 transition"
          >
            support@pagepulse.co
          </a>
          .
        </p>
      </section>
    </article>
  );
}
