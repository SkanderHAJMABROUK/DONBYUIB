export interface Actualite {
    id?: string;
    titre:string,
    description:string,
    etat:string,
    image:string,
    date_publication:Date,
    id_association?:string,
}
