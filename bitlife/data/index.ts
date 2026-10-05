// Content bundle: everything the simulation needs, assembled from the data files.
import type { Content } from '@bl/sim';
import { countries } from './countries.ts';
import { names } from './names.ts';
import { careers } from './careers.ts';
import { majors, grads, traits, talents, diseases, balance } from './catalog.ts';
import { actions } from './actions.ts';
import { relActions } from './relactions.ts';
import { events } from './events/index.ts';
import { crimes } from './crimes.ts';
import { assets, stocks, sectors } from './economy.ts';
import { countries2 } from './countries2.ts';
import { names2 } from './names2.ts';
import { diseases2 } from './diseases2.ts';
import { actions2 } from './actions2.ts';
import { relActions2 } from './relactions2.ts';
import { careers2 } from './careers2.ts';
import { actions3 } from './actions3.ts';
import { actions4 } from './actions4.ts';
import { actions5 } from './actions5.ts';
import { actions6 } from './actions6.ts';
import { relActions3 } from './relactions3.ts';
import { achievements, worldEvents, scenarios, challenges } from './meta.ts';

export const content: Content = {
  countries: [...countries, ...countries2], names: { ...names, ...names2 }, careers: [...careers, ...careers2], majors, grads, traits, talents,
  diseases: [...diseases, ...diseases2], events, actions: [...actions, ...actions2, ...actions3, ...actions4, ...actions5, ...actions6], relActions: [...relActions, ...relActions2, ...relActions3], balance,
  crimes, assets, stocks, sectors, achievements, worldEvents, scenarios, challenges,
};
export default content;
