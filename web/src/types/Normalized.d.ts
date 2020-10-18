type ID = { id: string };

type Normalized<T> = {
  [id: string]: T;
};
