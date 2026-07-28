'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Chatbot {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  _count: { documents: number; conversations: number };
}

export default function DashboardPage() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch('/api/chatbots')
      .then((r) => r.json())
      .then(setChatbots)
      .finally(() => setLoading(false));
  }, []);

  const createChatbot = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/chatbots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
        const bot = await res.json();
        setChatbots((prev) => [{ ...bot, _count: { documents: 0, conversations: 0 } }, ...prev]);
        setNewName('');
        setShowCreate(false);
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <nav className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            AI Way
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/billing" className="text-sm text-muted-foreground">
              Billing
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Your Chatbots</h1>
            <p className="text-muted-foreground text-sm">
              {chatbots.length} chatbot{chatbots.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90"
          >
            + New Chatbot
          </button>
        </div>

        {showCreate && (
          <div className="mb-6 p-4 bg-background border rounded-lg">
            <h3 className="font-medium mb-3">Create Chatbot</h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Chatbot name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <button
                onClick={createChatbot}
                disabled={creating || !newName.trim()}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 border rounded-md text-sm text-muted-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : chatbots.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🤖</div>
            <h2 className="text-xl font-semibold mb-2">No chatbots yet</h2>
            <p className="text-muted-foreground mb-4">
              Create your first chatbot to get started.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:opacity-90"
            >
              Create Your First Chatbot
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chatbots.map((bot) => (
              <Link
                key={bot.id}
                href={`/dashboard/chatbot/${bot.id}`}
                className="p-5 bg-background border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold">{bot.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      bot.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {bot.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {bot.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {bot.description}
                  </p>
                )}
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{bot._count.documents} docs</span>
                  <span>{bot._count.conversations} chats</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
