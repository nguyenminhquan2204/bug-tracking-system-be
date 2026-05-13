import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { SharedModule } from "src/shared/shared.module";
import { NotificationGateWay } from "./notification.gateway";

@Module({
   imports: [SharedModule],
   providers: [ChatGateway, NotificationGateWay],
   exports: [NotificationGateWay],
})
export class WebsocketModule {}