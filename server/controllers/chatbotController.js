// ==========================================
// GEMINI AI CHATBOT CONTROLLER
// Add your Gemini API key to server/.env:
// - GEMINI_API_KEY
// ==========================================

const handleChatMessage = async (req, res, next) => {
  try {
    const { message, history } = req.body; // history is array of { role: 'user'|'model', text: string }

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback Mock Assistant response if key is missing or placeholder
    if (!apiKey || apiKey === 'placeholder_gemini_api_key' || apiKey.startsWith('your_')) {
      const responseText = `[SIMULATED ASSISTANT - CONFIG KEY MISSING] Hello! I am NovaSphere's AI Support Agent. 
      To connect me to the live Google Gemini API, please edit **server/.env** and add your **GEMINI_API_KEY**. 
      
      For now, here is some quick information:
      - **Services**: We offer Custom Web Development, Android/iOS App Development, Enterprise Cloud Deployments, and AI consultation.
      - **Contact**: Reach our team at support@novasphere.com or write on the Contact page.
      - **Dashboard**: You can book new meetings and download receipt slips directly from your profile tab!`;

      return res.status(200).json({
        success: true,
        reply: responseText
      });
    }

    // Format history and current message into Gemini API format
    // Roles in Gemini API must be 'user' and 'model'
    const formattedContents = [];

    if (Array.isArray(history)) {
      history.forEach(item => {
        formattedContents.push({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.text }]
        });
      });
    }

    // Add current user prompt
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Invoke Gemini Pro model endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: formattedContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800
        }
      })
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      throw new Error(`Gemini API responded with status ${apiResponse.status}: ${errorText}`);
    }

    const data = await apiResponse.json();

    // Extract generated text
    let reply = '';
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      reply = data.candidates[0].content.parts[0].text;
    } else {
      reply = "I apologize, I could not process your question. Please try again.";
    }

    res.status(200).json({
      success: true,
      reply
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  handleChatMessage
};
