export interface AppComment {
  _id?: string;
  contenu: string;
  auteur?: {
    _id: string;
    nom: string;
  };
  article: string;
  parent?: string | null;
  date?: Date;
  children?: AppComment[];
}