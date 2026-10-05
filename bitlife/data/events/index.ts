import type { EventDef } from '@bl/sim';
import { milestoneEvents } from './milestones.ts';
import { childhoodEvents } from './childhood.ts';
import { teenEvents } from './teen.ts';
import { adultEvents } from './adult.ts';
import { systemEvents } from './system.ts';
import { moneyEvents } from './money.ts';
import { familyEvents } from './family.ts';
import { weirdEvents } from './weird.ts';
import { healthEvents } from './health.ts';
import { crimeEvents } from './crime.ts';
import { loveEvents } from './love.ts';
import { workEvents } from './work.ts';
import { lifeEvents } from './life.ts';
import { schoolEvents } from './school.ts';
import { careerEvents } from './careers.ts';
import { darkEvents } from './dark.ts';
import { socialEvents } from './social.ts';
import { worldEvents2 } from './world.ts';

export const events: EventDef[] = [
  ...milestoneEvents, ...childhoodEvents, ...teenEvents, ...adultEvents, ...systemEvents, ...moneyEvents,
  ...familyEvents, ...weirdEvents, ...healthEvents, ...crimeEvents, ...loveEvents, ...workEvents, ...lifeEvents, ...schoolEvents, ...careerEvents, ...darkEvents, ...socialEvents, ...worldEvents2,
];
