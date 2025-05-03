import { ITask } from '../types/task';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  allDay: boolean;
  color?: string;
  taskId?: string;
}

export class CalendarService {
  static async exportToGoogleCalendar(task: ITask): Promise<string> {
    const event = {
      summary: task.title,
      description: task.description,
      start: {
        dateTime: task.dueDate.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: new Date(task.dueDate.getTime() + 3600000).toISOString(), // 1 hora depois
        timeZone: 'America/Sao_Paulo',
      },
    };

    // Aqui você implementaria a integração com a API do Google Calendar
    // Por enquanto, retornamos uma URL para adicionar ao calendário manualmente
    const baseUrl = 'https://calendar.google.com/calendar/render';
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.summary,
      details: event.description,
      dates: `${this.formatDateForGoogle(event.start.dateTime)}/${this.formatDateForGoogle(event.end.dateTime)}`,
      ctz: 'America/Sao_Paulo',
    });

    return `${baseUrl}?${params.toString()}`;
  }

  static async exportToOutlook(task: ITask): Promise<string> {
    const event = {
      subject: task.title,
      body: task.description,
      start: task.dueDate.toISOString(),
      end: new Date(task.dueDate.getTime() + 3600000).toISOString(), // 1 hora depois
    };

    // Aqui você implementaria a integração com a API do Outlook Calendar
    // Por enquanto, retornamos uma URL para adicionar ao calendário manualmente
    const baseUrl = 'https://outlook.live.com/owa/';
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: event.subject,
      body: event.body,
      startdt: event.start,
      enddt: event.end,
    });

    return `${baseUrl}?${params.toString()}`;
  }

  private static formatDateForGoogle(date: string): string {
    return date.replace(/[-:]/g, '').replace('.000Z', 'Z');
  }

  static async syncWithCalendar(task: ITask): Promise<void> {
    // Aqui você implementaria a sincronização automática com o calendário
    // Por exemplo, usando webhooks ou polling
    console.log('Sincronizando tarefa com calendário:', task);
  }
} 