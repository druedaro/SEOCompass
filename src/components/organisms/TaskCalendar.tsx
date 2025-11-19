import { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg, DateSelectArg } from '@fullcalendar/core';
import type { Task } from '@/types/task';
import { STATUS_CONFIG } from '@/constants/tasks';
import type { TaskCalendarProps } from '@/types/componentTypes';

export function TaskCalendar({ tasks, onTaskClick, onDateSelect }: TaskCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);

  const events = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: task.due_date || task.created_at,
    end: task.due_date || task.created_at,
    backgroundColor: STATUS_CONFIG[task.status].color || '#6366f1',
    borderColor: STATUS_CONFIG[task.status].color || '#6366f1',
    extendedProps: {
      task,
    },
  }));

  const handleEventClick = (clickInfo: EventClickArg) => {
    const task = clickInfo.event.extendedProps.task as Task;
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (onDateSelect) {
      onDateSelect(selectInfo.start, selectInfo.end);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        eventClick={handleEventClick}
        select={handleDateSelect}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        height="auto"
        eventDisplay="block"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
        }}
      />
    </div>
  );
}
