// Importation des modules nécessaires pour utiliser LWC (Lightning Web Component) et les appels Apex
import { LightningElement, api, wire, track } from 'lwc';  // LightningElement est la base pour tous les composants LWC, api expose des propriétés aux autres composants, wire est utilisé pour les appels Apex, track permet de suivre les variables réactives
import  getOpportunities from '@salesforce/apex/AccountOpportunitiesController.getOpportunities';  // Importation de la méthode Apex pour récupérer les opportunités
import { refreshApex } from '@salesforce/apex';  // Importation de la fonction pour rafraîchir les résultats d'un appel Apex

export default class AccountOpportunitiesViewer extends LightningElement {
    @api recordId;  // Cette propriété permet d'accéder à l'ID de l'enregistrement depuis un composant parent (souvent un Account)
    @track opportunities;  // Utilisé pour stocker les données des opportunités retournées par Apex. @track rend cette variable réactive
    @track error = false;  // Stocke l'erreur si le chargement des opportunités échoue

    // Définition des colonnes pour le tableau des opportunités
    columns = [
        { label: 'Nom Opportunité', fieldName: 'Name', type: 'text' },  // Affiche le nom de l'opportunité
        { label: 'Montant', fieldName: 'Amount', type: 'currency' },  // Affiche le montant de l'opportunité
        { label: 'Date de Clôture', fieldName: 'CloseDate', type: 'date' },  // Affiche la date de clôture de l'opportunité
        { label: 'Phase', fieldName: 'StageName', type: 'text' }  // Affiche la phase de l'opportunité
    ];

    // Utilisation de @wire pour lier les données des opportunités à la méthode Apex getOpportunities
    // Cette méthode sera appelée automatiquement chaque fois que le recordId change
    @wire(getOpportunities, {accountId: "$recordId"})  // Appel de la méthode Apex en passant l'ID du compte (recordId)
    wiredOpportunities(result) {
        this.wiredResult = result;  // Stocke l'état de l'appel (données ou erreur)
        
        // Vérifie si les données sont présentes
        if (result.data) {
            this.opportunities = result.data;  // Si des données sont reçues, on les assigne à la variable 'opportunities'
            this.error = undefined;  // Si les données sont reçues, on réinitialise l'erreur
        } else if (result.error) {
            this.error = result.error;  // Si une erreur survient, on la stocke dans 'error'
            this.opportunities = undefined;  // On vide les opportunités en cas d'erreur
        }
    }

    // Méthode pour rafraîchir les données récupérées par @wire (utile si l'on veut recharger les données après modification)
    handleRafraichir() {
        return refreshApex(this.wiredResult);  // Rafraîchit les données en appelant à nouveau la méthode Apex
    }
}