import { baalBodhPart1 } from './baalBodhPart1';
import { baalBodhPart2 } from './baalBodhPart2';
import { baalBodhPart3 } from './baalBodhPart3';
import { baalBodhPart4 } from './baalBodhPart4';
import { baalBodhPart5 } from './baalBodhPart5';
import { baalBodhPart6 } from './baalBodhPart6';

export interface BaalBodhChapter {
  title: { hi: string; en: string };
  content: { hi: string; en: string };
  moral: { hi: string; en: string };
}

export interface BaalBodhBook {
  id: string;
  title: { hi: string; en: string };
  description: { hi: string; en: string };
  color: string;
  image: string;
  chapters: BaalBodhChapter[];
}

export const BAAL_BODH_BOOKS: BaalBodhBook[] = [
  ...baalBodhPart1,
  ...baalBodhPart2,
  ...baalBodhPart3,
  ...baalBodhPart4,
  ...baalBodhPart5,
  ...baalBodhPart6
];
