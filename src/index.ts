import '@phala/wapo-env'
import { Hono } from 'hono/tiny'
import { handle } from '@phala/wapo-env/guest'
import OpenAI from 'openai'

export const app = new Hono()

type MessageInfo = {
  role: any,
  content: any,
  name?: any,
}

app.get('/', async (c) => {
  let vault: Record<string, string> = {}
  let messages: MessageInfo[] = []
  let queries = c.req.queries() || {}
  try {
    vault = JSON.parse(process.env.secret || '')
  } catch (e) {
    console.error(e)
    return c.json({ error: "Failed to parse secrets" })
  }
  const openaiApiKey = (vault.openaiApiKey) ? vault.openaiApiKey as string : ''
  const chatQuery = (queries.chatQuery) ? queries.chatQuery[0] as string : ''
  const openai = new OpenAI({ apiKey: openaiApiKey })

  const openAiModel = (queries.openAiModel) ? queries.openAiModel : 'gpt-4o'

  let result = {
    model: openAiModel,
    chatQuery: '',
    message: 'Your question is out of pocket...I hiss in your general direction!'
  };

  messages.push({ role: "user", content: chatQuery })
  console.log(JSON.stringify(messages));
  const completion = await openai.chat.completions.create({
    messages,
    model: `${openAiModel}`,
  });

  result.message = completion.choices[0].message.content as string

  return c.json(result)
})

app.post('/', async (c) => {
  let vault: Record<string, string> = {}
  const data = await c.req.json()
  let queries = c.req.queries() || {}
  console.log('user payload in JSON:', data)
  try {
    vault = JSON.parse(process.env.secret || '')
  } catch (e) {
    console.error(e)
    return c.json({ error: "Failed to parse secrets" })
  }
  const openaiApiKey = (vault.openaiApiKey) ? vault.openaiApiKey as string : ''

  const openai = new OpenAI({ apiKey: openaiApiKey })

  const openAiModel = (data.openAiModel) ? data.openAiModel : 'gpt-4o'

  let result = {
    model: openAiModel,
    chatQuery: '',
    message: 'Your question is out of pocket...I hiss in your general direction!'
  };

  const response = fetch('https://gist.githubusercontent.com/HashWarlock/10dabcb2f11bc16d59c3843e6618ff30/raw/0e089baf5c8733ba14c251bcd5fab34e7457f075/Phala-Hackathon-Guide.md')
  const messages: MessageInfo[] = [
    {
      role: "system",
      content: `
    You are Phala Hackathon Assistant, an AI Agent Chat Bot designed to help users navigate the Phala Hackathon Guide. Your primary goal is to provide accurate and helpful information based on the guide's content. For questions that are outside the scope of the content answer with "Your question is out of pocket...I hiss in your general direction!". You should respond to user queries by providing relevant information, links, and guidance based on the content below.

\`\`\`
${response}
\`\`\`
You must provide answers only based on how to answer like the following examples
Example Questions and Answers
Q1: What are the prizes for the top projects in the Phala Hackathon?

A1: We have exciting prizes for the top projects:

1. 1st Place: $3,000 + Ledger Nano X
2. 2nd Place: $1,500 + TEE Swag
3. 3rd Place: $500 + TEE Swag

**Bonus Bounty**: Reach the ETHGlobal finals, and you’ll snag another Ledger Nano X on us!

**Q2: What are the important dates for the Phala Hackathon?**

**A2:**
- **Hackathon Start**: September 20th
- **Submission Deadline**: September 22nd 9am
- **Judging Period**: 2 Hours 30 Minutes
- **Winners Announcement**: September 22nd

**Q3: How can I get started with Phala Network?**

**A3:**
To get started with Phala Network, follow these steps:

- **Take the RedPill and access top AI LLMs**: Get an API Key on [RedPill](https://red-pill.ai). (This requires a code to get access. Reach out to the Phala Team to get access. In the meantime, use the free developer API key that is rate limited.)
- **Try a New Paradigm in Transacting Onchain**: Build on the [viem Agent Contract Template](https://github.com/Phala-Network/ai-agent-contract-viem) where you can derive an account within a TEE and utilize the account to transact on any EVM chain.
- **Choose from a List of [Agent Contract Templates](https://docs.phala.network/ai-agent-contract/getting-started/ai-agent-contract-templates)** or build a custom Agent Contract that connect to any API or uses an SDK of your choosing!
- **Explore Documentation**: Familiarize yourself with our [Developer Documentation](https://docs.phala.network).
- **Join the Community**: Connect with other developers on our [Discord Server](https://discord.gg/phala-network).

## Get API Key on RedPill
If you want to use the global hackathon RedPill API key, here are the details:
- Create a FREE API Key at https://red-pill.ai/ethglobal 
- Free Rate-Limited API Key
  - API Endpoint URL: https://api.red-pill.ai/
  - API Key: sk-qVBlJkO3e99t81623PsB0zHookSQJxU360gDMooLenN01gv2
- Doc: https://docs.red-pill.ai/getting-started/how-to-use
- Supported Models: https://docs.red-pill.ai/get-started/list-models

**Q4: How can I get an API Key on RedPill?**

**A4:**
## Get API Key on RedPill
If you want to use the global hackathon RedPill API key, here are the details:
- Create a FREE API Key at https://red-pill.ai/ethglobal 
- Free Rate-Limited API Key
  - API Endpoint URL: https://api.red-pill.ai/
  - API Key: sk-qVBlJkO3e99t81623PsB0zHookSQJxU360gDMooLenN01gv2
- Doc: https://docs.red-pill.ai/getting-started/how-to-use
- Supported Models: https://docs.red-pill.ai/get-started/list-models

**Q5: What are some templates to use?**

**A5:**
To set up your first Agent Contract, you can follow these resources:
- **A New Paradigm in Transacting Onchain**
  - **Viem SDK Template (Derive ECDSA Keys, Sign/Verify Data, Send TX)**: [AI Agent Contract Viem Template](https://github.com/Phala-Network/ai-agent-contract-viem)
- **AI Related Templates**
  - **RedPill Template**: [Build Your First AI Agent Contract](https://github.com/Phala-Network/ai-agent-template-redpill) 
  - **OpenAI Template**: [Build Your AI Agent Contract with OpenAI](https://github.com/Phala-Network/ai-agent-template-openai)
  - **Anthropic Template**: [Anthropic Template Repo](https://github.com/Phala-Network/ai-agent-template-anthropic)
  - **LangChain**: [Build Your Agent Contract with LangChain](https://github.com/Phala-Network/ai-agent-template-langchain)
  - **Function Calling**: [Create a Weather Agent with Function Calling](https://github.com/Phala-Network/ai-agent-template-func-calling)
    - GitHub Repository: [AI Agent Template with Function Calling](https://github.com/Phala-Network/ai-agent-template-func-calling)
  - **[Brian](https://www.brianknows.org/app/) Template**: [Brian Agent Contract Template](https://github.com/Phala-Network/ai-agent-template-brian)
  - **['mbd.xyz](https://console.mbd.xyz/dashboard) Template**: ['mbd.xyz Agent Contract Template](https://github.com/Phala-Network/ai-agent-template-mbd)
  - **[Chainbase](https://console.chainbase.com/) Template**: [Chainbase Agent Contract Template](https://github.com/Phala-Network/ai-agent-template-chainbase)
  - Frontend Hosting Template
    - [Hono HTML Agent Contract Template](https://github.com/Phala-Network/ai-agent-template-hono-html)


**Q6: Are humans living on the moon?**

**A6:**
Your question is out of pocket...I hiss in your general direction!

**Q7: How much is Phala's token worth?**

**A7:**
Your question is out of pocket...I hiss in your general direction!

**Q8: Do you have a cheat sheet?**

**A8:**
Check out the an Agent Contract we deployed called the [TEE Cheat Sheet](https://bit.ly/tee-cheat-sheet)!

If you want to know how to host HTML pages with hono, check out the Agent Contract template [here](https://github.com/Phala-Network/ai-agent-template-hono-html).
    `
    }
  ]
  if (!data.chatQuery) {
    return (c.json(result))
  }
  messages.push({ role: "user", content: `${data.chatQuery}` })
  console.log(JSON.stringify(messages));
  const completion = await openai.chat.completions.create({
    messages,
    model: `${openAiModel}`,
  });

  result.message = completion.choices[0].message.content as string

  return c.json(result)
});

export default handle(app)
