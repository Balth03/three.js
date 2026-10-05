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
import { youngEvents } from './young.ts';
import { money2Events } from './money2.ts';
import { babyEvents } from './baby.ts';
import { health2Events } from './health2.ts';
import { oldEvents } from './old.ts';
import { mafiaEvents } from './mafia.ts';
import { chaosEvents } from './chaos.ts';
import { love2Events } from './love2.ts';
import { jobs2Events } from './jobs2.ts';
import { hobbyEvents } from './hobby.ts';
import { teen2Events } from './teen2.ts';
import { prison2Events } from './prison2.ts';
import { family2Events } from './family2.ts';
import { friends2Events } from './friends2.ts';
import { holidayEvents } from './holidays.ts';
import { countryEvents } from './countries.ts';
import { dailyEvents } from './daily.ts';
import { trash2Events } from './trash2.ts';
import { career3Events } from './career3.ts';
import { kids2Events } from './kids2.ts';

export const events: EventDef[] = [
  ...milestoneEvents, ...childhoodEvents, ...teenEvents, ...adultEvents, ...systemEvents, ...moneyEvents,
  ...familyEvents, ...weirdEvents, ...healthEvents, ...crimeEvents, ...loveEvents, ...workEvents, ...lifeEvents, ...schoolEvents, ...careerEvents, ...darkEvents, ...socialEvents, ...worldEvents2, ...youngEvents, ...money2Events, ...babyEvents, ...health2Events, ...oldEvents, ...mafiaEvents, ...chaosEvents, ...love2Events, ...jobs2Events, ...hobbyEvents, ...teen2Events, ...prison2Events, ...family2Events, ...friends2Events, ...holidayEvents, ...countryEvents, ...dailyEvents, ...trash2Events, ...career3Events, ...kids2Events,
];
