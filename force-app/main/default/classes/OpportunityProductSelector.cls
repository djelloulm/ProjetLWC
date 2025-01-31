public with sharing class OpportunityProductSelector {
    @AuraEnabled(Cacheable=true)
    public static List<OpportunityLineItem> getOpportunityLineItems(Id opportunityId) {
        // Récupérer les Opportunités Line Items et les produits associés
        List<OpportunityLineItem> opportunitylineitems = 
        [SELECT Id, Product2.Id, OpportunityId, Quantity, UnitPrice, TotalPrice, Product2.Name, Product2.QuantityInStock__c, Out_of_Stock__c 
         FROM OpportunityLineItem 
         WHERE OpportunityId = :opportunityId];

        return opportunitylineitems;
    }

    @AuraEnabled(Cacheable=true)
    public static String getUserProfileName() {
        // Récupérer le nom du profil de l'utilisateur connecté
        Id profileId = UserInfo.getProfileId();
        String profileName = [SELECT Name FROM Profile WHERE Id = :profileId].Name;
        return profileName;
    }
}