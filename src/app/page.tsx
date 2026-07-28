import Link from 'next/link';

const features = [
  {
    title: 'No-Code Setup',
    description: 'Upload documents or paste your website URL. Your chatbot is ready in minutes.',
    icon: '🚀',
  },
  {
    title: 'Free AI Models',
    description: 'Powered by Google Gemini Flash - free tier with 15 requests/minute.',
    icon: '🤖',
  },
  {
    title: 'RAG-Powered',
    description: 'Retrieval-Augmented Generation ensures accurate, grounded responses from your data.',
    icon: '🎯',
  },
  {
    title: 'Embed Anywhere',
    description: 'One-line embed code for your website, app, or platform.',
    icon: '🔗',
  },
  {
    title: 'Multi-Language',
    description: 'Supports 100+ languages out of the box.',
    icon: '🌍',
  },
  {
    title: 'Privacy First',
    description: 'Your data stays yours. No training on your content.',
    icon: '🔒',
  },
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: ['1 chatbot', '30 pages', '100 queries/mo', 'Gemini Flash'],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Starter',
    price: '$5',
    features: ['2 chatbots', '200 pages', '500 queries/mo', 'Priority support'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    features: ['10 chatbots', '2,000 pages', '5,000 queries/mo', 'Remove branding', 'API access'],
    cta: 'Go Pro',
    popular: true,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            AI Way
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Login
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Build AI Chatbots<br />Trained on Your Data
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Create intelligent chatbots in minutes. Upload your documents, paste your website, or connect your data - no coding required. Powered by free AI models.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-md text-lg font-medium hover:opacity-90"
          >
            Start Free - No Card Required
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-4">Free forever. Upgrade when you need more.</p>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="p-6 border rounded-lg">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center mb-4">Pricing that makes sense</h2>
        <p className="text-muted-foreground text-center mb-12">
          10x cheaper than competitors. Free AI models keep costs near zero.
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-6 border rounded-lg ${
                plan.popular ? 'border-primary shadow-lg relative' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="text-4xl font-bold my-4">
                {plan.price}
                <span className="text-base font-normal text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`block text-center py-2 rounded-md font-medium ${
                  plan.popular
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-primary text-primary'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          AI Way &copy; {new Date().getFullYear()} &mdash; Build smarter chatbots for less.
        </div>
      </footer>
    </div>
  );
}
