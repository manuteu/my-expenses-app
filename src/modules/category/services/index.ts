import { api } from '@/app/config/axios';
import type { ICategoriesResponse, ICategory, ICreateCategoryInput } from '../types';

class CategoryService {
  private readonly baseUrl = '/categories';

  getCategories = async () => {
    const response = await api.get<ICategoriesResponse>(this.baseUrl);
    return response.data;
  };

  createCategory = async (data: ICreateCategoryInput) => {
      const response = await api.post<ICategory>(this.baseUrl, data);
    return response.data;
  };
}

export const categoryService = new CategoryService();
