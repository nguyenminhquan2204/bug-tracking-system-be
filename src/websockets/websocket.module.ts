import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { SharedModule } from "src/shared/shared.module";

@Module({
   imports: [SharedModule],
   providers: [ChatGateway],
})
export class WebsocketModule {}