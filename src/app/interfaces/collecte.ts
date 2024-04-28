export interface Collecte {
    id?: string;
    nom:string,
    description:string,
    image:string,
    etat:string,
    montant:number;
    cumul:number;
    date_debut:Date,
    date_fin: Date,
    id_association?:string,
}
