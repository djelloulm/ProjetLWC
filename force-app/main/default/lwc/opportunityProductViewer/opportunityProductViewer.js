import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getOpportunities from '@salesforce/apex/OppProdViewerController.getOpportunities';
import getUserProfileNameController from '@salesforce/apex/OppProdViewerController.getUserProfileNameController';
import { deleteRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import nomduProduit from '@salesforce/label/c.Nom_du_produit';
import pasdeProduitMessage from '@salesforce/label/c.Pas_de_produits_message';
import prixTotal from '@salesforce/label/c.Prix_total';
import prixUnitaire from '@salesforce/label/c.Prix_unitaire';
import quantite from '@salesforce/label/c.Quantite';
import supprimer from '@salesforce/label/c.Supprimer';
import quantiteEnStock from '@salesforce/label/c.Quantite_en_stock';
import voirProduit from '@salesforce/label/c.Voir_produit';
import customTitle from '@salesforce/label/c.Titre_du_composant';
import messageQuantite from '@salesforce/label/c.messageErreurQuantite';
import adminProfilName from '@salesforce/label/c.Profil_Name';

export default class OpportunityProductViewer extends NavigationMixin(LightningElement) {
    @api recordId; // ID de l'opportunité
    @track opportunities; // Liste des opportunités avec leurs produits
    @track error; // Gestion des erreurs
    @track showLoadingSpinner = false; // Affichage du spinner de chargement
    @track isAdmin = false; // Vérification si l'utilisateur est un admin
    @track messageQuantite = false; // Affichage du message de rupture de stock
    @track adminProfilName = false; // Stocke le nom du profil admin

    messageProduit = pasdeProduitMessage;
    customlabelTitle = customTitle;
    messagelabelQuantite = messageQuantite;

    // Définition des colonnes affichées dans le tableau
    columns = [
        { label: nomduProduit, fieldName: 'Product2.Name', type: 'text' }, 
        {   
            label: quantite, 
            fieldName: 'Quantity', 
            type: 'number',
            cellAttributes: { 
                class: { fieldName: 'quantityClass' } // Ajout de classes CSS dynamiques
            }
        },   
        { label: prixTotal, fieldName: 'TotalPrice', type: 'currency' },
        { label: prixUnitaire, fieldName: 'UnitPrice', type: 'currency' }, 
        { label: quantiteEnStock, fieldName: 'Product2.QuantityInStock__c', type: 'number' }, 
        {
            label: supprimer,
            type: 'button-icon',
            typeAttributes: {
                iconName: 'utility:delete',
                name: 'delete',
                iconClass: 'slds-icon-text-error'
            }
        },
        {
            label: voirProduit,
            type: 'button',
            typeAttributes: {
                label: voirProduit,
                name: 'view',
                variant: 'brand',
                iconName: 'utility:preview'
            },
        }
    ];

    // Vérifie le profil utilisateur et ajuste l'affichage si nécessaire
    @wire(getUserProfileNameController)
    wiredActivities({ error, data }) {
        if (data) {
            this.isAdmin = (data === adminProfilName);
            this.error = undefined;

            // Si l'utilisateur n'est pas admin, on enlève la colonne "Voir produit"
            if (!this.isAdmin) {
                this.columns = this.columns.filter(col => col.label !== voirProduit);
            }
        } else if (error) {
            this.error = error;
            this.isAdmin = false;
        }
    }

    // Récupère les opportunités et applique les styles en fonction du stock
    @wire(getOpportunities, { opportunityId: "$recordId" })
    wiredOpportunities(result) {
        this.wiredResult = result;

        if (result.data) {
            let hasOutOfStock = false; // Vérifie si un produit est en rupture

            this.opportunities = result.data.map((elem) => {
                console.log(`Produit: ${elem.Product2?.Name}, Out_of_Stock__c: ${elem.Out_of_Stock__c}`); // Debug

                if (elem.Out_of_Stock__c) {
                    hasOutOfStock = true;
                }

                return {
                    ...elem,
                    quantityClass: elem.Out_of_Stock__c ? 'slds-box slds-theme_shade slds-theme_alert-texture slds-text-color_error' : 'slds-text-color_success',
                    'Product2.Name': elem.Product2?.Name, 
                    'TotalPrice': elem.TotalPrice,
                    'Quantity': elem.Quantity,
                    'UnitPrice': elem.UnitPrice,
                    'Product2.QuantityInStock__c': elem.Product2?.QuantityInStock__c
                };
            });

            this.messageQuantite = hasOutOfStock; // Active le message si besoin
            this.noProducts = this.opportunities.length === 0;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.opportunities = undefined;
            this.messageQuantite = false; 
            this.noProducts = false;
        }
    }

    // Gestion des actions utilisateur (Voir ou Supprimer un produit)
    handleRowLevelAct(event) {
        const recordId = event.detail.row.Id;
        const actionName = event.detail.action.name;

        switch (actionName) {
            case 'view': // Navigation vers l'enregistrement du produit
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: recordId,
                        objectApiName: 'OpportunityLineItem',
                        actionName: 'view'
                    }
                });
                break;

            case 'delete': // Suppression du produit
                this.showLoadingSpinner = true;
                deleteRecord(recordId)
                    .then(() => {
                        this.showLoadingSpinner = false;
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Succès',
                                message: 'Le produit a été supprimé avec succès.',
                                variant: 'success'
                            })
                        );
                        return refreshApex(this.wiredResult);
                    })
                    .catch(error => {
                        this.showLoadingSpinner = false;
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Erreur',
                                message: error.body.message,
                                variant: 'error'
                            })
                        );
                    });
                break;
        }
    }
}
