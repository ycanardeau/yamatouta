// https://github.com/elastic/eui/issues/5463#issuecomment-1107665339
import { ICON_TYPES } from '@elastic/eui';
import { icon as arrowEnd } from '@elastic/eui/es/components/icon/assets/arrowEnd';
import { icon as arrowStart } from '@elastic/eui/es/components/icon/assets/arrowStart';
import { icon as arrowDown } from '@elastic/eui/es/components/icon/assets/arrow_down';
import { icon as arrowLeft } from '@elastic/eui/es/components/icon/assets/arrow_left';
import { icon as arrowRight } from '@elastic/eui/es/components/icon/assets/arrow_right';
import { icon as cross } from '@elastic/eui/es/components/icon/assets/cross';
import { icon as empty } from '@elastic/eui/es/components/icon/assets/empty';
import { icon as popout } from '@elastic/eui/es/components/icon/assets/popout';
import { icon as search } from '@elastic/eui/es/components/icon/assets/search';
import { icon as sortDown } from '@elastic/eui/es/components/icon/assets/sort_down';
import { icon as sortUp } from '@elastic/eui/es/components/icon/assets/sort_up';
import { icon as sortable } from '@elastic/eui/es/components/icon/assets/sortable';
import { appendIconComponentCache } from '@elastic/eui/es/components/icon/icon';
import { ValuesType } from 'utility-types';

type IconComponentNameType = ValuesType<typeof ICON_TYPES>;
type IconComponentCacheType = Partial<Record<IconComponentNameType, unknown>>;

const cachedIcons: IconComponentCacheType = {
	arrowDown,
	arrowEnd,
	arrowLeft,
	arrowRight,
	arrowStart,
	cross,
	empty,
	popout,
	search,
	sortDown,
	sortUp,
	sortable,
};

appendIconComponentCache(cachedIcons);
