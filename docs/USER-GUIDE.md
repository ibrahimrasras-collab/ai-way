# AI Way — User Guide

A complete guide to building, training, and deploying AI chatbots with AI Way.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Creating Your Account](#creating-your-account)
3. [Building Your First Chatbot](#building-your-first-chatbot)
4. [Adding Data Sources](#adding-data-sources)
5. [Customizing Your Chatbot](#customizing-your-chatbot)
6. [Testing Your Chatbot](#testing-your-chatbot)
7. [Embedding on Your Website](#embedding-on-your-website)
8. [Managing Your Account](#managing-your-account)
9. [Pricing & Limits](#pricing--limits)
10. [Troubleshooting](#troubleshooting)

---

## Getting Started

AI Way lets you create AI chatbots that understand your content. You can:

- Upload documents (PDF, TXT, CSV, JSON, Markdown)
- Crawl entire websites automatically
- Customize the chatbot's personality and behavior
- Embed it on any website with one line of code
- Use it for customer support, lead generation, or internal tools

### What You Need

- An email address
- A website or documents to train the chatbot on
- (Optional) A [Google AI Studio](https://aistudio.google.com/) API key for higher limits

---

## Creating Your Account

1. Go to **ai-way.com** (or your self-hosted URL)
2. Click **"Get Started Free"**
3. Enter your:
   - Full name
   - Email address
   - Password (minimum 8 characters)
4. Click **"Create Account"**
5. You'll be redirected to the login page
6. Sign in with your email and password

> Your free plan includes 1 chatbot, 30 pages, and 100 queries per month.

---

## Building Your First Chatbot

### Step 1: Create a Chatbot

1. After logging in, you'll see the **Dashboard**
2. Click **"+ New Chatbot"** in the top right
3. Enter a name for your chatbot (e.g., "Support Bot", "Product FAQ")
4. Click **"Create"**

Your chatbot is now created but empty. Let's add some data.

### Step 2: Add Data

Click on your chatbot card to open the **Chatbot Builder**. You'll see three tabs: **Data**, **Settings**, and **Preview**.

You're on the **Data** tab. You have two options:

#### Option A: Add a Website

1. Enter your website URL (e.g., `https://yourcompany.com`)
2. Click **"Add Website"**
3. The crawler will automatically:
   - Visit every page on your site
   - Extract the text content
   - Split it into chunks
   - Convert it to vector embeddings
4. You'll see the source appear with a status:
   - 🟡 **CRAWLING** — Currently processing
   - 🟢 **COMPLETED** — Ready to use
   - 🔴 **FAILED** — Something went wrong

> The crawler processes up to 30 pages by default. It follows internal links but ignores external ones.

#### Option B: Upload Documents

1. Click **"Choose File"** under "Upload Document"
2. Select a file from your computer:
   - **TXT** — Plain text files
   - **MD** — Markdown files
   - **CSV** — Comma-separated values
   - **JSON** — Structured data
   - **PDF** — PDF documents
3. The file will be processed automatically
4. You'll see it appear in the sources list

> **Tip:** For best results, use well-structured documents with clear headings and paragraphs.

### Step 3: Wait for Processing

Documents and websites need to be processed before your chatbot can use them. Processing usually takes:

- **Single document:** 5–30 seconds
- **Small website (10 pages):** 1–3 minutes
- **Large website (50 pages):** 5–10 minutes

You can check the status on the Data tab.

---

## Customizing Your Chatbot

Click the **Settings** tab to customize your chatbot.

### Chatbot Name

Change the display name shown to users.

### System Prompt

The system prompt tells your chatbot how to behave. Examples:

**Customer Support Bot:**
```
You are a helpful customer support assistant for Acme Corp. 
Answer questions based on the provided documentation. 
If you don't know the answer, say "I'm not sure, let me connect you with our team."
Be friendly, professional, and concise.
```

**Sales Bot:**
```
You are a sales assistant for Acme Corp. 
Help visitors find the right product or plan. 
Highlight key features and benefits. 
If they seem ready to buy, direct them to our pricing page.
```

**Internal Wiki Bot:**
```
You are an internal knowledge assistant. 
Answer questions based on the company wiki. 
Be factual and cite your sources when possible.
```

### AI Model

Choose which AI model powers your chatbot:

| Model | Speed | Quality | Cost |
|---|---|---|---|
| **Gemini 1.5 Flash** | Fast | Great | Free |
| **Gemini 1.5 Pro** | Slower | Best | Free (limited) |

> **Recommendation:** Start with Gemini Flash. It's fast, accurate, and free.

### Temperature

Controls how creative vs. factual the responses are:

- **0.0** — Very factual, deterministic (good for support)
- **0.5** — Balanced
- **1.0** — More creative (good for brainstorming)

> **Recommendation:** Use 0.3–0.5 for support bots, 0.7 for general use.

### Max Tokens

Controls the maximum length of responses:

- **256** — Short answers (FAQ-style)
- **512** — Medium answers
- **1024** — Long, detailed answers (default)

After making changes, click **"Save Settings"**.

---

## Testing Your Chatbot

Click the **Preview** tab to test your chatbot before deploying.

1. Type a question in the input field
2. Press **Enter** or click **"Send"**
3. The chatbot will respond using your data

### Testing Tips

- Ask questions that your customers would ask
- Test edge cases ("What if I ask about something not in the docs?")
- Check if the bot correctly refuses to answer when it doesn't know
- Test in different languages if you serve international customers
- Try asking follow-up questions to test context handling

### Interpreting Results

- **Good response:** Accurate, based on your data, helpful
- **Partial response:** Right topic but missing details — add more data
- **Wrong response:** The bot may be hallucinating — check your data quality
- **"I don't know":** The bot is being honest — this is often the desired behavior

---

## Embedding on Your Website

Once you're happy with your chatbot, it's time to put it on your website.

### Method 1: Script Tag (Recommended)

Copy the embed code from the **Preview** tab and add it to your HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <!-- Your content here -->

  <script 
    src="https://your-domain.com/widget.js" 
    data-chatbot-id="YOUR_CHATBOT_ID">
  </script>
</body>
</html>
```

The chatbot will appear as a floating bubble in the bottom-right corner.

### Method 2: WordPress

1. Go to your WordPress admin
2. Navigate to **Appearance → Theme Editor**
3. Open `footer.php`
4. Add the script tag before `</body>`
5. Save

### Method 3: Shopify

1. Go to **Online Store → Themes**
2. Click **Actions → Edit Code**
3. Open `theme.liquid`
4. Add the script tag before `</body>`
5. Save

### Method 4: Squarespace / Wix

1. Go to **Settings → Advanced → Code Injection**
2. Paste the script tag in the **Footer** section
3. Save

### Widget Features

The embedded widget includes:

- **Floating bubble** — Click to open/close
- **Chat interface** — Full conversation support
- **Responsive design** — Works on mobile and desktop
- **Typing indicator** — Shows when the bot is thinking
- **Welcome message** — Customizable greeting

---

## Managing Your Account

### Dashboard Overview

The dashboard shows all your chatbots with:

- **Name** — Chatbot display name
- **Status** — Active or Inactive
- **Documents** — Number of indexed documents
- **Conversations** — Total chat sessions

### Creating Additional Chatbots

Click **"+ New Chatbot"** to create more chatbots for different use cases:

- **Support Bot** — Customer service
- **Sales Bot** — Lead qualification
- **FAQ Bot** — Common questions
- **Internal Bot** — Team knowledge base

### Deleting a Chatbot

1. Open the chatbot
2. Go to **Settings**
3. Scroll to the bottom
4. Click **"Delete Chatbot"**
5. Confirm the deletion

> **Warning:** This action cannot be undone. All data, conversations, and embeddings will be permanently deleted.

---

## Pricing & Limits

### Free Plan

| Resource | Limit |
|---|---|
| Chatbots | 1 |
| Pages/documents | 30 |
| Queries per month | 100 |
| Tokens stored | 1 million |
| Team members | 1 |

### Starter Plan — $5/month

| Resource | Limit |
|---|---|
| Chatbots | 2 |
| Pages/documents | 200 |
| Queries per month | 500 |
| Tokens stored | 5 million |
| Team members | 1 |

### Pro Plan — $19/month

| Resource | Limit |
|---|---|
| Chatbots | 10 |
| Pages/documents | 2,000 |
| Queries per month | 5,000 |
| Tokens stored | 50 million |
| Team members | 5 |
| Remove AI Way branding | ✓ |
| API access | ✓ |

### Enterprise Plan — $49/month

| Resource | Limit |
|---|---|
| Chatbots | Unlimited |
| Pages/documents | Unlimited |
| Queries per month | Unlimited |
| Tokens stored | Unlimited |
| Team members | Unlimited |
| Remove AI Way branding | ✓ |
| API access | ✓ |
| Priority support | ✓ |

### What Are Tokens?

- **1 token ≈ 0.75 words** (or ~4 characters)
- "Hello, how are you?" = ~6 tokens
- A 1,000-word document = ~1,300 tokens
- Storage tokens = total content indexed across all chatbots
- Query tokens = used per conversation turn

---

## Troubleshooting

### Chatbot isn't responding

1. Check that documents are processed (status = COMPLETED)
2. Verify the chatbot is **Active** (toggle in Settings)
3. Try a simpler question to test basic functionality
4. Check the browser console for errors

### Responses are inaccurate

1. Add more relevant data sources
2. Improve your system prompt to be more specific
3. Lower the temperature (0.3–0.5) for more factual responses
4. Check if your documents have conflicting information

### Website crawler failed

1. Verify the URL is accessible (try opening it in a browser)
2. Check if the site blocks bots (robots.txt, firewalls)
3. Try a different URL or specific pages
4. Ensure the site doesn't require JavaScript rendering

### Widget not showing

1. Check the script tag is placed before `</body>`
2. Verify the `data-chatbot-id` matches your chatbot ID
3. Open browser console and look for errors
4. Ensure your domain is allowed in CORS settings

### Slow responses

1. Use **Gemini Flash** instead of Gemini Pro
2. Reduce the max tokens in Settings
3. Check your server's performance
4. Consider upgrading your hosting plan

### Hit usage limits

1. Check your usage on the Dashboard
2. Upgrade your plan for higher limits
3. Optimize your prompts to use fewer tokens
4. Remove unused chatbots and data

---

## Best Practices

### Data Quality

- **Be specific:** Detailed documents produce better answers
- **Avoid duplicates:** Conflicting information confuses the bot
- **Keep it updated:** Re-crawl websites when content changes
- **Use structure:** Headers and lists help the bot understand context

### System Prompts

- **Be explicit:** Tell the bot what to do AND what not to do
- **Set boundaries:** Define when the bot should escalate to a human
- **Match your brand:** Use your company's tone and terminology
- **Include examples:** Show the bot what good answers look like

### Performance

- **Start small:** Test with a few documents before scaling
- **Monitor usage:** Track which questions get the best answers
- **Iterate:** Continuously improve your data and prompts
- **Gather feedback:** Ask users if the bot was helpful

---

## Support

- **Documentation:** [docs.ai-way.com](https://docs.ai-way.com)
- **Email:** support@ai-way.com
- **GitHub:** [github.com/ibrahimrasras-collab/ai-way](https://github.com/ibrahimrasras-collab/ai-way)
- **Issues:** [GitHub Issues](https://github.com/ibrahimrasras-collab/ai-way/issues)

---

## Glossary

| Term | Definition |
|---|---|
| **RAG** | Retrieval-Augmented Generation — using retrieved documents to ground AI answers |
| **Embedding** | Converting text to a numerical vector for similarity search |
| **Vector** | A list of numbers representing the meaning of text |
| **Chunk** | A piece of a document used for embedding |
| **Token** | A unit of text (~0.75 words) used for billing |
| **pgvector** | PostgreSQL extension for vector similarity search |
| **System Prompt** | Instructions that define the chatbot's behavior |
| **Widget** | The embeddable chat interface |
| **Crawl** | Automatically visiting and indexing website pages |
