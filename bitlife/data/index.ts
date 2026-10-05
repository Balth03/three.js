// Content bundle: everything the simulation needs, assembled from the data files.
import type { Content } from '@bl/sim';
import { countries } from './countries.ts';
import { names } from './names.ts';
import { careers } from './careers.ts';
import { majors, grads, traits, talents, diseases, balance } from './catalog.ts';
import { actions } from './actions.ts';
import { relActions } from './relactions.ts';
import { events } from './events/index.ts';

export const content: Content = { countries, names, careers, majors, grads, traits, talents, diseases, events, actions, relActions, balance };
export default content;
