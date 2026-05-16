import { HfInference } from "@huggingface/inference";

interface ConversationMessage {
    role: "user" | "assistant";
    content: string;
}

class PetAdvisorService {
    private hf: HfInference;
    private conversationHistory: Map<string, ConversationMessage[]> = new Map();

    constructor() {
        const apiToken = process.env.HUGGINGFACE_API_KEY;
        if (!apiToken) {
            throw new Error("HUGGINGFACE_API_KEY environment variable is required");
        }
        this.hf = new HfInference(apiToken);
    }

    private getPetAdvisorSystemPrompt(): string {
        return `You are a knowledgeable and friendly pet advisor for PawCare, a comprehensive pet care platform. 
Your expertise covers:
- Pet health and wellness advice
- Behavioral guidance for dogs, cats, birds, and other common pets
- Nutrition and diet recommendations
- Training tips and techniques
- Emergency care guidance (with appropriate disclaimers)
- Grooming and hygiene advice
- Mental enrichment and exercise recommendations

Important guidelines:
1. Always be friendly and supportive
2. For serious health concerns, recommend consulting a veterinarian
3. Provide practical, actionable advice
4. Be honest when you don't have enough information to help
5. Ask clarifying questions when needed
6. Never replace professional veterinary advice with your recommendations
7. Keep responses concise but informative (2-3 paragraphs max)`;
    }

    async getResponse(userId: string, userMessage: string): Promise<string> {
        try {
            // Get or initialize conversation history for this user
            if (!this.conversationHistory.has(userId)) {
                this.conversationHistory.set(userId, []);
            }

            const history = this.conversationHistory.get(userId)!;

            // Build conversation messages for the API
            const messages = history.map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

            // Add current user message
            messages.push({
                role: "user",
                content: userMessage,
            });

            // Call Hugging Face API
            const response = await this.hf.textGeneration({
                model: "mistralai/Mistral-7B-Instruct-v0.1",
                inputs: this.formatMessagesForAPI(messages),
                parameters: {
                    max_new_tokens: 500,
                    temperature: 0.7,
                    top_p: 0.95,
                    do_sample: true,
                },
            });

            const assistantMessage = response.generated_text
                .replace(userMessage, "")
                .trim()
                .split("[/INST]")
                .pop()
                ?.trim() || response.generated_text;

            // Store in conversation history
            history.push({
                role: "user",
                content: userMessage,
            });
            history.push({
                role: "assistant",
                content: assistantMessage,
            });

            // Keep only last 10 exchanges to manage memory
            if (history.length > 20) {
                this.conversationHistory.set(userId, history.slice(-20));
            }

            return assistantMessage;
        } catch (error: any) {
            throw new Error(`Pet Advisor error: ${error.message}`);
        }
    }

    private formatMessagesForAPI(
        messages: Array<{ role: string; content: string }>,
    ): string {
        const systemPrompt = this.getPetAdvisorSystemPrompt();
        let formatted = `[INST] ${systemPrompt}\n\n`;

        for (const msg of messages) {
            if (msg.role === "user") {
                formatted += `${msg.content} [/INST] `;
            } else {
                formatted += `${msg.content} </s><s> [INST] `;
            }
        }

        return formatted;
    }

    async clearHistory(userId: string): Promise<void> {
        this.conversationHistory.delete(userId);
    }

    async getConversationHistory(userId: string): Promise<ConversationMessage[]> {
        return this.conversationHistory.get(userId) || [];
    }
}

export default new PetAdvisorService();
