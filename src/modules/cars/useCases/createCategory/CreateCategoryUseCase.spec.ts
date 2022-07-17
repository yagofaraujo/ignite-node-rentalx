import { CategoriesRepositoryInMemory } from '@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory';
import { CreateCategoryUseCase } from '@modules/cars/useCases/createCategory/CreateCategoryUseCase';
import { AppError } from '@shared/errors/AppError';

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe('Create Category', () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMemory,
    );
  });

  it('Should be able to create a new category', async () => {
    const category = {
      name: 'Category Test',
      description: 'Category description test',
    };

    await createCategoryUseCase.execute(category);

    const createdCategory = await categoriesRepositoryInMemory.findByName(
      category.name,
    );

    expect(createdCategory).toHaveProperty('id');
  });

  it('Should not be able to create a new category when name already exists', async () => {
    const category = {
      name: 'Category Test',
      description: 'Category description test',
    };

    await createCategoryUseCase.execute(category);

    await expect(createCategoryUseCase.execute(category)).rejects.toEqual(
      new AppError('Category already exists!'),
    );
  });
});
