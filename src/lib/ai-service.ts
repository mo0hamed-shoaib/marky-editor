export interface AIResponse {
  content: string
  error?: string
}

export class AIService {
  private static async makeRequest(prompt: string, systemPrompt?: string): Promise<AIResponse> {
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          systemPrompt: systemPrompt || `You are an AI assistant that creates highly structured, actionable mindmaps optimized for learning and implementation.

CRITICAL STRUCTURING RULES:

1. **Separate Concepts from Actions:**
   - Concepts: What something IS (e.g., "React Hooks", "Branding System")
   - Actions: What to DO (e.g., "Learn React Hooks", "Implement Branding")

2. **Avoid Duplication & Unify Terms:**
   - Merge overlapping concepts (e.g., "Branding/Brand Identity/Logo Design" → "Branding System")
   - Use consistent terminology throughout
   - Group related items under unified parent nodes

3. **Learning Node Structure (for educational content):**
   Each learning node should include:
   - **Outcomes:** What you'll achieve
   - **Practice:** How to practice/apply
   - **Deliverable:** What you'll create/produce
   - **Prerequisites:** What you need to know first (optional)
   - **Resources:** Helpful materials (optional)

4. **Markmap Formatting Rules:**
   - Use headers (# ## ###) ONLY for first 3 levels (depth 0-2)
   - Use indented lists (- item) for deeper levels (depth 3+)
   - Calculate indentation as: '  '.repeat(depth - 3)
   - Never exceed 3 header levels

Example Structure:
# Web Development
## Frontend Development
### React Framework
  - **Outcomes:** Build interactive UIs, manage state, create components
  - **Practice:** Build todo app, portfolio site, e-commerce cart
  - **Deliverable:** Deployed React application
  - **Prerequisites:** JavaScript, HTML, CSS
  - **Resources:** React docs, freeCodeCamp, Codecademy

Always respond with only the markdown structure, no explanations.`
        })
      })

      if (!response.ok) {
        throw new Error(`OpenRouter API request failed: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('AI request failed:', error)
      return { 
        content: '', 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }

  static async createMarkmap(prompt: string): Promise<AIResponse> {
    const promptText = `Create a comprehensive, well-structured mindmap based on this request: "${prompt}"

STRUCTURING REQUIREMENTS:
- Separate concepts from actions clearly
- Avoid duplication and unify overlapping terms
- For learning content, include Outcomes, Practice, and Deliverables for each learning node
- Group related concepts under unified parent nodes
- Use consistent terminology throughout

Please respond with only the markdown structure, no explanations.`
    
    return this.makeRequest(promptText)
  }

  static async convertTextToMarkmap(text: string): Promise<AIResponse> {
    const promptText = `Convert the following text into a well-organized mindmap structure:

IMPORTANT: Follow Markmap formatting rules:
- Use headers (# ## ###) for first 3 levels only
- Use indented lists (- item) for deeper levels
- Never exceed 3 header levels
- Extract main ideas and organize them logically

Text to convert:
${text}

Please respond with only the markdown structure, no explanations.`
    
    return this.makeRequest(promptText)
  }

  static async improveMarkmap(markdown: string): Promise<AIResponse> {
    const promptText = `Review and improve this mindmap structure to make it more organized, logical, and comprehensive:

IMPROVEMENT FOCUS:
- Separate concepts from actions clearly
- Merge overlapping/duplicate terms into unified nodes
- Add missing Outcomes, Practice, and Deliverables for learning nodes
- Improve logical grouping and hierarchy
- Ensure consistent terminology throughout
- Add missing connections and relationships

Current mindmap:
${markdown}

Please respond with only the improved markdown structure, no explanations.`
    
    return this.makeRequest(promptText)
  }

  static async suggestContent(markdown: string): Promise<AIResponse> {
    const promptText = `Analyze this mindmap and suggest additional content, topics, or ideas that would make it more comprehensive:

IMPORTANT: Follow Markmap formatting rules:
- Use headers (# ## ###) for first 3 levels only
- Use indented lists (- item) for deeper levels
- Never exceed 3 header levels
- Suggest new branches, subtopics, examples, or related concepts

Current mindmap:
${markdown}

Please respond with only the additional content in markdown format, no explanations.`
    
    return this.makeRequest(promptText)
  }
}
