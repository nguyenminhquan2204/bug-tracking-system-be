import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProjectService } from 'src/routes/project/project.service';
import { EmailService } from 'src/shared/services/email.service';

@Injectable()
export class ProjectExpirationReminderJob {
   constructor(
      private readonly projectService: ProjectService,
      private readonly emailService: EmailService
   ) {}

   // @Cron(CronExpression.EVERY_10_SECONDS)
   @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
   async handle() {
      const projects = await this.projectService.getProjectsNearDeadline();

      const reminderData = projects.flatMap((project) =>
         project.members.map((member) => ({
            projectName: project.name,
            endDate: project.endDate,
            email: member.user?.email,
            userName: member.user?.userName,
         })),
      );

      console.log('ReminderData: ', reminderData);

      await Promise.all([
         ...reminderData.map((data) => this.emailService.sendRemindNearProject(data))
      ]);
   }
}