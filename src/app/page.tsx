import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            DatabaseToki
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Your Personal Supabase for Vercel 🚀
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
            Multi-tenant JSON database. Create unlimited projects, each with isolated storage. 
            Perfect for serverless deployments.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105"
            >
              Create Your Database
            </Link>
            <Link
              href="#how-it-works"
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all"
            >
              How It Works
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
            <div className="text-4xl mb-4">1️⃣</div>
            <h3 className="text-xl font-bold mb-3">Create Project</h3>
            <p className="text-gray-400">
              Get unique project ID and API key. Each project is completely isolated from others.
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
            <div className="text-4xl mb-4">2️⃣</div>
            <h3 className="text-xl font-bold mb-3">Create Tables</h3>
            <p className="text-gray-400">
              Any table you want - users, posts, products. Schema-less JSON storage.
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
            <div className="text-4xl mb-4">3️⃣</div>
            <h3 className="text-xl font-bold mb-3">CRUD Operations</h3>
            <p className="text-gray-400">
              REST API for insert, select, update, delete. Works with any HTTP client.
            </p>
          </div>
        </div>

        {/* API Example */}
        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 mb-20">
          <h2 className="text-3xl font-bold mb-6 text-center">Simple API</h2>
          
          <div className="bg-gray-900 p-6 rounded-lg overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`// Create project
curl -X POST https://databasetoki.vercel.app/api/projects \\
  -H "Content-Type: application/json" \\
  -d '{"name":"my-app"}'

// Insert data
curl -X POST https://databasetoki.vercel.app/api/my-app/users \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com"}'

// Query data
curl https://databasetoki.vercel.app/api/my-app/users?eq.email=user@example.com \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
            </pre>
          </div>
        </div>

        {/* Pricing */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Simple Pricing</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
              <h3 className="text-2xl font-bold mb-4">Free</h3>
              <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-400">/month</span></div>
              <ul className="text-left text-gray-400 space-y-3 mb-8">
                <li>✅ 1 project</li>
                <li>✅ 100MB storage</li>
                <li>✅ Basic API</li>
                <li>✅ Community support</li>
              </ul>
              <Link href="/dashboard" className="block w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold transition-all">
                Start Free
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-b from-blue-900 to-gray-800 p-8 rounded-2xl border-2 border-blue-600 transform scale-105">
              <div className="bg-blue-600 text-white text-sm font-bold px-4 py-1 rounded-full inline-block mb-4">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <div className="text-4xl font-bold mb-6">$9<span className="text-lg text-gray-400">/month</span></div>
              <ul className="text-left text-gray-300 space-y-3 mb-8">
                <li>✅ 10 projects</li>
                <li>✅ 1GB storage</li>
                <li>✅ Advanced queries</li>
                <li>✅ Priority support</li>
                <li>✅ Custom domains</li>
              </ul>
              <Link href="/dashboard?plan=pro" className="block w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition-all">
                Go Pro
              </Link>
            </div>

            {/* Business */}
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
              <h3 className="text-2xl font-bold mb-4">Business</h3>
              <div className="text-4xl font-bold mb-6">$29<span className="text-lg text-gray-400">/month</span></div>
              <ul className="text-left text-gray-400 space-y-3 mb-8">
                <li>✅ Unlimited projects</li>
                <li>✅ 10GB storage</li>
                <li>✅ SLA support</li>
                <li>✅ Custom integrations</li>
                <li>✅ White-label option</li>
              </ul>
              <Link href="/contact" className="block w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold transition-all">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Deploy your own database in seconds
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-full text-lg transition-all transform hover:scale-105"
          >
            Get Started Free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2026 DatabaseToki. Built for serverless.</p>
        </div>
      </footer>
    </main>
  );
}
