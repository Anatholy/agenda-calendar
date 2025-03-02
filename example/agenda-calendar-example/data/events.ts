import { ExtendedEvent } from "types/types";


  export const events: ExtendedEvent[] = [
    {
      id: '1',
      title: 'Mathematics Lecture',
      date: new Date('2024-03-20'),
      startTime: '09:00',
      endTime: '10:30',
      location: 'Room 101',
      type: 'lesson'
    },
    {
      id: '2',
      title: 'Physics Test',
      date: new Date('2024-03-20'),
      startTime: '11:00',
      endTime: '12:30',
      location: 'Main Hall',
      type: 'test'
    },
    {
      id: '3',
      title: 'Final Examination',
      date: new Date('2024-03-20'),
      startTime: '14:00',
      endTime: '16:00',
      location: 'Examination Center',
      type: 'innerExam'
    },
    {
      id: '4',
      title: 'Study Group Meeting',
      date: new Date('2024-03-21'),
      startTime: '10:00',
      endTime: '11:30',
      location: 'Library',
      type: 'other'
    },
    {
      id: '5',
      title: 'Chemistry Lab',
      date: new Date('2024-03-22'),
      startTime: '13:00',
      endTime: '14:30',
      location: 'Lab 3',
      type: 'lesson'
    },
    {
      id: '6',
      title: 'Biology Quiz',
      date: new Date('2024-03-22'),
      startTime: '15:00',
      endTime: '16:00',
      location: 'Room 205',
      type: 'test'
    }
  ];