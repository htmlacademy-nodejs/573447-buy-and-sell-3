/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import path from 'path';
import { Router } from 'express';
import multer, { Multer } from 'multer';
import { SsrOffersPath, SsrPath } from '~/common/enums';
import { SsrRouterSettings } from '~/express/common';
import { getFileExtension, getHttpErrors, getRandomId } from '~/helpers';
import { getOfferData } from './helpers';

const UPLOAD_DIR = `../../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (_, file, cb) => {
    const uniqueName = getRandomId();
    const extension = getFileExtension(file.originalname);

    cb(null, `${uniqueName}.${extension}`);
  },
});

const upload = multer({ storage });

const initOffersRouter = (app: Router, settings: SsrRouterSettings): void => {
  const offersRouter = Router();
  const { api } = settings;

  app.use(SsrPath.OFFERS, offersRouter);

  offersRouter.get(SsrOffersPath.CATEGORY_$CATEGORY_ID, (_, res) => {
    return res.render(`category`);
  });

  offersRouter.get(SsrOffersPath.ADD, async (_, res) => {
    const categories = await api.getCategories();

    return res.render(`offers/ticket-edit`, {
      offer: {},
      categories,
    });
  });

  offersRouter.post(
    SsrOffersPath.ADD,
    upload.single(`avatar`),
    async (req, res) => {
      const { body, file } = req;
      const offerData = getOfferData(body, file?.filename);

      try {
        await api.createOffer(offerData);

        return res.redirect(SsrPath.MY);
      } catch (err: unknown) {
        const categories = await api.getCategories();

        return res.render(`offers/ticket-edit`, {
          offer: offerData,
          categories,
          errorMessages: getHttpErrors(err),
        });
      }
    },
  );

  offersRouter.get(SsrOffersPath.EDIT_$OFFER_ID, async (req, res) => {
    const { id } = req.params;
    const [offer, categories] = await Promise.all([
      api.getOffer(Number(id)),
      api.getCategories(),
    ]);

    return res.render(`offers/ticket-edit`, {
      offer,
      categories,
    });
  });

  offersRouter.post(
    SsrOffersPath.EDIT_$OFFER_ID,
    upload.single(`avatar`),
    async (req, res) => {
      const { body, file, params } = req;
      const offerData = getOfferData(body, file?.filename);

      try {
        await api.updateOffer(Number(params.id), offerData);

        return res.redirect(SsrPath.MY);
      } catch (err: unknown) {
        const categories = await api.getCategories();

        return res.render(`offers/ticket-edit`, {
          offer: offerData,
          categories,
          errorMessages: getHttpErrors(err),
        });
      }
    },
  );

  offersRouter.get(SsrOffersPath.$OFFER_ID, async (req, res) => {
    const { id } = req.params;
    const offer = await api.getOffer(Number(id));

    return res.render(`offers/ticket`, {
      item: offer,
    });
  });
};

export { initOffersRouter };
