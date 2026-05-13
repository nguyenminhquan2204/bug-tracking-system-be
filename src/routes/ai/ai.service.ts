import { Injectable, HttpException } from '@nestjs/common';
import envConfig from 'src/shared/config';

@Injectable()
export class AiService {
   private async askDeepSeak(prompt: string) {
      try {
         const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${envConfig.DEEPSEEK_API_KEY}`,
            },
            body: JSON.stringify({
               model: 'deepseek-chat',
               messages: [
                  {
                     role: 'system',
                     content: 'You are a senior software engineer.'
                  },
                  {
                     role: 'user',
                     content: prompt
                  }
               ],
               temperature: 0.7
            })
         });

         if (!res.ok) {
            const errorText = await res.text();
            console.error('DeepSeek Error:', errorText);
            throw new Error('DeepSeek API failed');
         }

         const data = await res.json();

         return data.choices[0].message.content;

      } catch (error) {
         console.error(error);

         throw new HttpException(
            'AI service is temporarily unavailable',
            500
         );
      }
   }

   private async askGemini(prompt: string) {
      const res = await fetch(
         `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${envConfig.GEMINI_API_KEY}`,
         {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               contents: [
                  {
                     parts: [{ text: prompt }]
                  }
               ]
            })
         }
      );

      console.log('Res', res);

      if (!res.ok) {
         const errorText = await res.text();
         console.error('Gemini Error:', errorText);
         throw new Error('Gemini API failed');
      }

      const data = await res.json();

      return data.candidates?.[0]?.content?.parts?.[0]?.text;
   }

   async suggestFix(data: string) {
      if (!data || data.length < 10) {
         throw new HttpException('Invalid input', 400);
      }

      const prompt = `${data}`;
      const result = await this.askGemini(prompt);
      console.log('Gemini: ', result);
      return result;
   }
}