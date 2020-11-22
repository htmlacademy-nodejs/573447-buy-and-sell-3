import {
  getRandomItem,
  getRandomItems,
  getRandomNumber,
  getTwoDigitalString,
  writeToFile,
} from '~/helpers';
import {IOffer} from '~/common/interfaces';
import {CliCommandName, CliExitCode, OfferType} from '~/common/enums';
import {MocksConfig} from './common';

const offerTypes = Object.values(OfferType);

const generateOffer = (): IOffer => ({
  title: getRandomItem(MocksConfig.TITLES),
  picture: `item${getTwoDigitalString(
    getRandomNumber(
      MocksConfig.PICTURE_NUMBER.MIN,
      MocksConfig.PICTURE_NUMBER.MAX
    )
  )}.jpg`,
  description: getRandomItems(
    MocksConfig.DESCRIPTION.DESCRIPTIONS,
    getRandomNumber(
      MocksConfig.DESCRIPTION.MIN_COUNT,
      MocksConfig.DESCRIPTION.MAX_COUNT
    )
  ).join(` `),
  type: getRandomItem(offerTypes),
  sum: getRandomNumber(MocksConfig.PRICE.MIN, MocksConfig.PRICE.MAX),
  category: getRandomItems(
    MocksConfig.CATEGORY.CATEGORIES,
    getRandomNumber(
      MocksConfig.CATEGORY.MIN_COUNT,
      MocksConfig.CATEGORY.CATEGORIES.length
    )
  ),
});

const generateMockedOffers = (count: number): IOffer[] => {
  const mockedOffers = Array.from(new Array(count), generateOffer);

  return mockedOffers;
};

export default {
  name: CliCommandName.GENERATE,
  run(args: string[]) {
    const [count] = args;
    const offersCount = Number(count) || MocksConfig.DEFAULT_COUNT;

    if (offersCount > MocksConfig.MAX_COUNT) {
      console.error(`Не больше 1000 объявлений`);

      return;
    }

    const mockedOffers = generateMockedOffers(offersCount);

    writeToFile(MocksConfig.FILE_NAME, JSON.stringify(mockedOffers), (err) => {
      if (err) {
        console.error(`Can't write data to file...`);

        process.exit(CliExitCode.ERROR);
      }

      console.log(`Operation success. File created.`);
    });
  },
};