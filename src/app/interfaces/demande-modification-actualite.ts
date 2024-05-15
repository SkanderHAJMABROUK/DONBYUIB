export interface DemandeModificationActualite {
    id?:string,
    id_actualite?:string,
    id_association?:string,
    titre:string,
    description:string,
    image:string,
    etat:string,
    date: Date,
    id_admin?:string
}
