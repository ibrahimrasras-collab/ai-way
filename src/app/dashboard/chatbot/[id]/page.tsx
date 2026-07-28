'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Chatbot {
  id: string;
  name: string;
  description: string | null;
  systemPrompt: string;
  model: string;
  isActive: boolean;
  documents: { id: string; name: string; status: string; tokens: number }[];
  sources: { id: string; url: string | null; status: string; pageCount: number }[];
}

export default function ChatbotBuilderPage() {
  const params = useParams();
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [activeTab, setActiveTab] = useState<'settings' | 'data' | 'preview'>('data');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [crawling, setCrawling] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetch(`/api/chatbots/${params.id}`)
      .then((r) => r.json())
      .then(setChatbot);
  }, [params.id]);

  const addWebsite = async () => {
    if (!websiteUrl.trim()) return;
    setCrawling(true);
    try {
      await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatbotId: params.id, url: websiteUrl }),
      });
      setWebsiteUrl('');
      const res = await fetch(`/api/chatbots/${params.id}`);
      setChatbot(await res.json());
    } finally {
      setCrawling(false);
    }
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('chatbotId', params.id as string);
    formData.append('file', file);
    await fetch('/api/upload', { method: 'POST', body: formData });
    const res = await fetch(`/api/chatbots/${params.id}`);
    setChatbot(await res.json());
  };

  const testChat = async () => {
    if (!testMessage.trim()) return;
    setTesting(true);
    try {
      const res = await fetch('/api/widget/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: testMessage, chatbotId: params.id }),
      });
      const data = await res.json();
      setTestResponse(data.message);
    } finally {
      setTesting(false);
    }
  };

  const embedCode = `<script src="${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/widget.js" data-chatbot-id="${params.id}"></script>`;

  if (!chatbot) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <nav className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-muted-foreground">
            ← Dashboard
          </Link>
          <span className="text-sm text-muted-foreground">/</span>
          <span className="text-sm font-medium">{chatbot.name}</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">{chatbot.name}</h1>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              chatbot.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {chatbot.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="flex gap-1 mb-6 border-b">
          {(['data', 'settings', 'preview'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'data' && (
          <div className="space-y-6">
            <div className="p-6 bg-background border rounded-lg">
              <h3 className="font-semibold mb-3">Add Website</h3>
              <div className="flex gap-3">
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={addWebsite}
                  disabled={crawling || !websiteUrl.trim()}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {crawling ? 'Crawling...' : 'Add Website'}
                </button>
              </div>
            </div>

            <div className="p-6 bg-background border rounded-lg">
              <h3 className="font-semibold mb-3">Upload Document</h3>
              <input
                type="file"
                onChange={uploadFile}
                accept=".txt,.md,.csv,.json,.pdf"
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Supports TXT, MD, CSV, JSON, PDF
              </p>
            </div>

            <div className="p-6 bg-background border rounded-lg">
              <h3 className="font-semibold mb-3">
                Sources ({chatbot.sources.length + chatbot.documents.length})
              </h3>
              {chatbot.sources.length === 0 && chatbot.documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No data sources yet. Add a website or upload a document.
                </p>
              ) : (
                <div className="space-y-2">
                  {chatbot.sources.map((src) => (
                    <div key={src.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="text-sm truncate">{src.url}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        src.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {src.status} - {src.pageCount} pages
                      </span>
                    </div>
                  ))}
                  {chatbot.documents.filter((d) => !chatbot.sources.some((s) => s.id)).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="text-sm truncate">{doc.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        doc.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-6 bg-background border rounded-lg max-w-2xl">
            <h3 className="font-semibold mb-4">Chatbot Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  defaultValue={chatbot.name}
                  className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">System Prompt</label>
                <textarea
                  defaultValue={chatbot.systemPrompt}
                  rows={4}
                  className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Model</label>
                <select
                  defaultValue={chatbot.model}
                  className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                >
                  <option value="gemini-flash">Gemini 1.5 Flash (Free)</option>
                  <option value="gemini-pro">Gemini 1.5 Pro (Free)</option>
                </select>
              </div>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">
                Save Settings
              </button>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div className="p-6 bg-background border rounded-lg">
              <h3 className="font-semibold mb-3">Test Chat</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Ask a question..."
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && testChat()}
                    className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={testChat}
                    disabled={testing || !testMessage.trim()}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    {testing ? 'Thinking...' : 'Send'}
                  </button>
                </div>
                {testResponse && (
                  <div className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap">
                    {testResponse}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-background border rounded-lg">
              <h3 className="font-semibold mb-3">Embed Code</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Add this code to your website to embed the chatbot widget:
              </p>
              <code className="block p-3 bg-muted rounded-md text-xs break-all">
                {embedCode}
              </code>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
