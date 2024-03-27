export interface DemandeCollecte {
    id?:string,
    id_collecte?: string;
    nom:string,
    description:string,
    image:string,
    etat:string,
    montant:number;
    date_debut:Date,
    date_fin: Date,
    id_association?:string,
    date:Date
}
