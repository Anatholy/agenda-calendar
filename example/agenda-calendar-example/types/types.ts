import { Event } from '../../../src';

export type EventType = 'lesson' | 'test' | 'innerExam' | 'other';

export interface ExtendedEvent extends Event {
  startTime: string;
  endTime: string;
  location: string;
  type: EventType;
}