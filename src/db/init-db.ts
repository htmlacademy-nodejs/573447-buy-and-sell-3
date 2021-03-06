import { Sequelize } from 'sequelize';
import { ModelAlias } from '~/common/enums';
import { MockedOffer } from '~/common/types';
import { defineModels } from './define-models';

type MockedPayload = {
  categories: string[];
  offerTypes: string[];
  offers: MockedOffer[];
};

const initDb = async (
  sequelize: Sequelize,
  { categories, offers, offerTypes }: MockedPayload,
): Promise<void> => {
  const { Category, OfferType, Offer } = defineModels(sequelize);
  await sequelize.sync({
    force: true,
  });

  const categoryModels = await Category.bulkCreate(
    categories.map((item) => ({
      name: item,
    })),
  );

  const offerTypesModels = await OfferType.bulkCreate(
    offerTypes.map((item) => ({
      name: item,
    })),
  );

  const categoryIdByName = categoryModels.reduce(
    (acc, next) => ({
      ...acc,
      [next.name]: next.id,
    }),
    {},
  );

  const offerTypeIdByName = offerTypesModels.reduce(
    (acc, next) => ({
      ...acc,
      [next.name]: next.id,
    }),
    {},
  );

  const offerPromises = offers.map(async (offer) => {
    const offerModel = await Offer.create(
      {
        ...offer,
        offerTypeId: offerTypeIdByName[offer.type],
      },
      {
        include: [ModelAlias.COMMENTS],
      },
    );

    await offerModel.addCategories(
      offer.categories.map((name) => categoryIdByName[name]),
    );
  });

  await Promise.all(offerPromises);
};

export { initDb };
