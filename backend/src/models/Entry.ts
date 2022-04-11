import { Artist } from '../entities/Artist';
import { Quote } from '../entities/Quote';
import { Translation } from '../entities/Translation';
import { Work } from '../entities/Work';

export type Entry = Translation | Artist | Quote | Work;
