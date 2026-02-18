import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import envConfig from '../config';
import fs from 'fs';
import path from 'path';

const bugAssignTemplate = fs.readFileSync(
  path.resolve('src/shared/email-templates/bug-assign.html'),
  { encoding: 'utf-8' }
);

const bugResolvedTemplate = fs.readFileSync(
  path.resolve('src/shared/email-templates/bug-resolved.html'),
  { encoding: 'utf-8' }
);

@Injectable()
export class EmailService {
   private resend: Resend;

   constructor() {
      this.resend = new Resend(envConfig.RESEND_API_KEY);
   }

   private renderTemplate(template: string, data: Record<string, any>) {
      return Object.keys(data).reduce((html, key) => {
         return html.replaceAll(`{{${key}}}`, String(data[key] ?? ''));
      }, template);
   }

   async sendBugAssignedEmail(payload: {
      email: string;
      userName: string;
      bugId: number;
      bugTitle: string;
      priority: string;
      assignedBy: string;
      bugUrl: string;
   }) {
      const subject = `New Bug Assigned - #${payload.bugId}`;

      const html = this.renderTemplate(bugAssignTemplate, {
         userName: payload.userName,
         bugId: payload.bugId,
         bugTitle: payload.bugTitle,
         priority: payload.priority,
         assignedBy: payload.assignedBy,
         bugUrl: payload.bugUrl,
      });

      return this.resend.emails.send({
         from: 'Bug Tracking System <no-reply@nguyenquandev.io.vn>',
         to: [payload.email],
         subject,
         html,
      });
   }

   async sendBugResolvedEmail(payload: {
      email: string;
      userName: string;
      bugId: number;
      bugTitle: string;
      fixedBy: string;
      bugUrl: string;
   }) {
      const subject = `Bug Resolved - #${payload.bugId}`;

      const html = this.renderTemplate(bugResolvedTemplate, {
         userName: payload.userName,
         bugId: payload.bugId,
         bugTitle: payload.bugTitle,
         fixedBy: payload.fixedBy,
         bugUrl: payload.bugUrl,
      });

      return this.resend.emails.send({
         from: 'Bug Tracking System <no-reply@nguyenquandev.io.vn>',
         to: [payload.email],
         subject,
         html,
      });
   }
}
