export type ICategoriesResponse = ICategory[];

export interface ICategory {
  _id: string;
  user: string;
  name: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCategoryInput {
  name: string;
  icon?: string;
  color?: string;
}

export interface ICategoryUpdateInput {
  name?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
}