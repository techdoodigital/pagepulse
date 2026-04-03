import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | PagePulse",
  description: "Terms of Service for PagePulse",
};

export default function TermsOfServicePage() {
  return (
    <article className="prose prose-invert prose-slate max-w-none">
      <h1 className="text-3xl font-bold text-slate-100 mb-2">
        Terms of Service
      </h1>
      <p className="text-sm text-slate-500 mb-12">
        Last updated: March 2026
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-200 mb-3">
          1. Acceptance of Terms
        </h2>
        <p className="text-slate-400 leading-relaxed">
          By accessing or using PagePulse (&quot;the Service&quot;), you agree to be bound
          by these Terms of Service (&quot;Terms&quot;). If you do not agree to all of
          these Terms, you may not access or use the Service. We reserve the
          right to update these Terms at any time, and your continued use of
          the Service constitutes acceptance of any changes.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-200 mb-3">
          2. Description of Service
        </h2>
        <p className="text-slate-400 leading-relaxed">
          PagePulse is a SaaS platform that provides AI-powered content auditing
          and optimization services. The Service analyzes web content across
          multiple dimensions and provides scoring, recommendations, and
          rewrite suggestions designed to improve content quality and AI
          citability. Features, functionality, and availability of the Service
          may change at our discretion without prior notice.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-200 mb-3">
          3. User Accounts
        </h2>
        <p className="text-slate-400 leading-relaxed">
          To access certain features of the Service, you must create an
          account. You are responsible for maintaining the confidentiality of
          your account credentials and for all activity that occurs under your
          account. You agree to provide accurate and complete information when
          creating your account and to update your information as necessary to
          keep it current. You must notify us immediately of any unauthorized
          use of your account. PagePulse is not liable for any loss or damage
          arising from your failure to safeguard your account information.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-200 mb-3">
          4. Subscription &amp; Billing
        </h2>
        <p className="text-slate-400 leading-relaxed mb-3">
          PagePulse offers both free and paid subscription plans. By selecting a
          paid plan, you agree to pay the applicable fees as described at the
          time of purchase. Subscriptions are billed on a recurring basis
          (monthly or annually, depending on the plan selected) and will
          automatically renew unless cancelled before the end of the current
          billing period.
        </p>
        <p className="text-slate-400 leading-relaxed">
          All fees are non-refundable except as expressly stated in these Terms
          or required by applicable law. We reserve the right to change our
          pricing at any time, with reasonable notice provided to existing
          subscribers. Payment processing is handled by Stripe, and by using
          the Service you also agree to Stripe&apos;s terms of service.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-200 mb-3">
          5. Acceptable Use
        </h2>
        <p className="text-slate-400 leading-relaxed mb-3">
          You agree to use the Service only for lawful purposes and in
          accordance with these Terms. You may not:
        </p>
        <ul className="list-disc list-inside text-slate-400 space-y-1.5 ml-2">
          <li>
            Use the Service to violate any applicable law, regulation, or
            third-party rights
          </li>
          <li>
            Attempt to gain unauthorized access to the Service, other accounts,
            or related systems
          </li>
          <li>
            Transmit any malicious code, viruses, or disruptive technology
          </li>
          <li>
            Use automated tools to scrape, crawl, or extract data from the
            Service beyond normal usage
          </li>
          <li>
            Resell, redistribute, or sublicense access to the Service without
            written consent
          </li>
          <li>
            Interfere with or disrupt the integrity or performance of the
            Service
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-200 mb-3">
          6. Intellectual Property
        </h2>
        <p className="text-slate-400 leading-relaxed">
          All content, features, and functionality of the Service,
          including but not limited to text, graphics, logos, software, and
          algorithms, are owned by PagePulse and are protected by
          copyright, trademark, and other intellectual property laws. You
          retain ownership of any content you submit to the Service for
          analysis. By using the Service, you grant PagePulse a limited,
          non-exclusive license to process your content solely for the purpose
          of providing the Service. We do not claim ownership over your content
          or use it for any purpose other than delivering the Service.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-200 mb-3">
          7. Limitation of Liability
        </h2>
        <p className="text-slate-400 leading-relaxed">
          To the maximum extent permitted by applicable law, PagePulse and its
          officers, directors, employees, and agents shall not be liable for
          any indirect, incidental, special, consequential, or punitive
          damages, including but not limited to loss of profits, data, use, or
          goodwill, arising out of or in connection with your access to or use
          of the Service. In no event shall our total liability exceed the
          amount you have paid to PagePulse in the twelve (12) months preceding
          the event giving rise to the liability. The Service is provided on an
          &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind,
          either express or implied.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-200 mb-3">
          8. Termination
        </h2>
        <p className="text-slate-400 leading-relaxed">
          You may terminate your account at any time by contacting us or using
          the account settings within the Service. We may suspend or terminate
          your access to the Service at any time, with or without cause, and
          with or without notice. Upon termination, your right to use the
          Service ceases immediately. Any provisions of these Terms that by
          their nature should survive termination shall continue to apply,
          including but not limited to intellectual property provisions,
          disclaimers, and limitations of liability.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-200 mb-3">
          9. Changes to Terms
        </h2>
        <p className="text-slate-400 leading-relaxed">
          We reserve the right to modify these Terms at any time. When we make
          material changes, we will update the &quot;Last updated&quot; date at the top
          of this page and, where appropriate, notify you via email or through
          the Service. Your continued use of the Service after any changes
          constitutes your acceptance of the revised Terms. We encourage you to
          review these Terms periodically to stay informed of any updates.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-200 mb-3">
          10. Contact
        </h2>
        <p className="text-slate-400 leading-relaxed">
          If you have any questions about these Terms of Service, please
          contact us at{" "}
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
