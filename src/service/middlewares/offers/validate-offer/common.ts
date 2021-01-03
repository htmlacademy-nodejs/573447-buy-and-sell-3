import { OfferKey } from '~/common/enums';
import { OfferIdParam } from '~/common/types';

type Params = OfferIdParam;

const offerRequireKeys = [
  OfferKey.CATEGORIES,
  OfferKey.DESCRIPTION,
  OfferKey.PICTURE,
  OfferKey.TITLE,
  OfferKey.TYPE,
  OfferKey.SUM,
] as const;

export { Params, offerRequireKeys };
