public with sharing class OppProdViewerController {

    // Méthode pour récupérer les Opportunités Line Items et les Produits associés
    @AuraEnabled(cacheable=true)
    public static List<OpportunityLineItem> getOpportunities(Id opportunityId) {
        return OpportunityProductSelector.getOpportunityLineItems(opportunityId);
    }

    // Méthode pour récupérer le nom du profil de l'utilisateur connecté
    @AuraEnabled(cacheable=true)
    public static String getUserProfileNameController() {
        return OpportunityProductSelector.getUserProfileName(); 
    }
}