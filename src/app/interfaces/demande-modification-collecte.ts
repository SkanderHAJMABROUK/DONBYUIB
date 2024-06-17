export interface DemandeModificationCollecte {
  id?: string;
  id_collecte?: string;
  nom: string;
  description: string;
  image: string;
  date_debut: Date;
  date_fin: Date;
  id_association?: string;
  etat: string;
  date: Date;
  id_admin?: string;
}
