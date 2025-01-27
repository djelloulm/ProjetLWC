public class OpportunityProductSelector {
@AuraEnabled(Cacheable=true)
    public static List<OpportunityLineItem> getOpportunityLineItems(Id opportunityId) {
        // Récupérer les Opporunités Line Items et les produits associés
        List<OpportunityLineItem> opportunitylineitems = 
        [SELECT Id,Product2.Id, OpportunityId,Quantity,UnitPrice,TotalPrice, Product2.Name, Product2.QuantityInStock__c, Out_of_Stock__c 
        FROM OpportunityLineItem 
        WHERE OpportunityId = :opportunityId];

        return opportunitylineitems;
    }
@AuraEnabled(Cacheable=true)
    public static String getUserProfileName() {
        // Récupérer l'ID du profil de l'utilisateur connecté
        Id profileId = UserInfo.getProfileId();
        String profileName =[Select Id, Name from Profile where Id=:profileId].Name;
        return profileName;
    }
}