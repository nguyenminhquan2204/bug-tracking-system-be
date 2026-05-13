import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
   constructor(private readonly aiService: AiService) {}

   @Post('/deepseek/suggest-fix')
   async suggestFix(@Body() body: { data: string }) {
      return this.aiService.suggestFix(body.data);
   }
}
