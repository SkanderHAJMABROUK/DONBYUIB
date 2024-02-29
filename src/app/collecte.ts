export interface Collecte {
    id?: string;
    nom:string,
    description:string,
    image:string,
    montant:number;
    date_debut:Date,
    date_fin: Date,
    id_association:string,
}
