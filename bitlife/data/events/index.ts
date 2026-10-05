import type { EventDef } from '@bl/sim';
import { milestoneEvents } from './milestones.ts';
import { childhoodEvents } from './childhood.ts';
import { teenEvents } from './teen.ts';
import { adultEvents } from './adult.ts';

export const events: EventDef[] = [...milestoneEvents, ...childhoodEvents, ...teenEvents, ...adultEvents];
