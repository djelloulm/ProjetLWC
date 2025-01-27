import { LightningElement, track, api } from 'lwc';
import findCasesBySubject from '@salesforce/apex/AccountCasesController.findCasesBySubject';

const COLUMNS = [
    { label: 'Sujet', fieldName: 'Subject', type: 'text' },
    { label: 'Statut', fieldName: 'Status', type: 'text' },
    { label: 'Priorité', fieldName: 'Priority', type: 'text' },
];

export default class AccountCaseSearchComponent extends LightningElement {
    @api recordId;  // ID du compte passé en tant que propriété
    @track cases;    // Liste des cas récupérés
    @track error;    // Message d'erreur en cas de problème
    searchTerm = ''; // Terme de recherche du sujet
    columns = COLUMNS; // Colonnes du tableau

    // Mise à jour du terme de recherche lorsque l'utilisateur tape quelque chose
    updateSearchTerm(event) {
        this.searchTerm = event.target.value;
    }

    // Effectue la recherche de cas basée sur le sujet
    handleSearch() {
        // Appel à la méthode Apex en passant l'ID du compte et le sujet recherché
        findCasesBySubject({ subject: this.searchTerm, accountId: this.recordId })
            .then(result => {
                // Si la recherche réussit, affecter les cas à la variable 'cases'
                this.cases = result;
                this.error = undefined;
            })
            .catch(error => {
                // En cas d'erreur, afficher les détails de l'erreur Apex
                console.error('Erreur Apex:', error);
                this.error = error.body.message || 'Une erreur est survenue lors de la recherche des cases.';
                this.cases = undefined;
            });
    }
}