import { Router } from 'express';
import { ApiPath, CategoryApiPath, HttpCode } from '~/common/enums';
import { Category } from '~/service/data';

const initCategoryApi = (app: Router, service: Category): void => {
  const categoryRouter = Router();

  app.use(ApiPath.CATEGORIES, categoryRouter);

  categoryRouter.get(CategoryApiPath.ROOT, async (_req, res) => {
    const categories = await service.findAll();

    return res.status(HttpCode.OK).json(categories);
  });
};

export { initCategoryApi };
