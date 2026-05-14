import { Module } from '@nestjs/common';
import { ProjectExpirationReminderJob } from './services/project-expiration-reminder.job';
import { ProjectModule } from 'src/routes/project/project.module';

@Module({
   imports: [
      ProjectModule
   ],
   providers: [
      ProjectExpirationReminderJob
   ],
})
export class CronJobsModule {}