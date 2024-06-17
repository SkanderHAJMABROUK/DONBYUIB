export interface Donateur {
  id?: string;
  nom: string;
  prenom: string;
  photo: string;
  etat: string;
  date_de_naissance: Date;
  telephone: string;
  adresse: string;
  gouvernerat: string;
  email: string;
  mdp: string;
  salt: string;
  id_admin?: string;
}
