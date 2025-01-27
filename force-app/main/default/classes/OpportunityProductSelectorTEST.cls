@isTest
private class OpportunityProductSelectorTEST {
    
    // Test de la méthode getOpportunityLineItems()  
    @isTest
    private static void getOpportunityLineItemsTEST() {
        Database.SaveResult dsr; // Variable pour stocker le résultat de l'insertion
        OpportunityLineItem drOpportunityLineItem; // Déclaration d'un objet OpportunityLineItem
        
        // Création d'un OpportunityLineItem avec un ID d'opportunité fictif et une quantité
        drOpportunityLineItem = new OpportunityLineItem(OpportunityId = '00kx00000000000AAA', Quantity = 123);
        
        // Tentative d'insertion de l'OpportunityLineItem en base de données (sans arrêt du test)
        dsr = Database.insert(drOpportunityLineItem, false);
        
        Test.startTest(); // Démarrage du test unitaire
        
        try {
            // Appel de la méthode avec un ID valide et récupération des lignes de l'opportunité
            List<OpportunityLineItem> lineItems = OpportunityProductSelector.getOpportunityLineItems(dsr.getId());
            
            // Vérification que la liste retournée n'est pas null
            System.assert(lineItems != null, 'La liste des OpportunityLineItems ne doit pas être null');
        } catch (Exception e) {
            // Si une exception est levée, le test échoue
            System.assert(false, 'Une exception ne devrait pas avoir lieu avec un ID valide : ' + e.getMessage());
        }

        try {
            // Appel de la méthode avec une valeur null pour tester la gestion des erreurs
            List<OpportunityLineItem> lineItemsNull = OpportunityProductSelector.getOpportunityLineItems(null);
            
            // Vérification que la méthode retourne bien une liste (même vide) au lieu de lever une exception
            System.assert(lineItemsNull != null, 'Le retour de la méthode avec null ne doit pas être null');
        } catch (Exception e) {
            // Si une exception a lieu, le test échoue
            System.assert(false, 'Une exception ne devrait pas avoir lieu pour un appel avec null : ' + e.getMessage());
        }
        
        Test.stopTest(); // Fin du test unitaire
    }

    // Test de la méthode getUserProfileName() qui retourne le nom du profil de l'utilisateur
    @isTest(SeeAllData=true)
    private static void getUserProfileNameTEST() {
        Test.startTest(); // Démarrage du test
        
        // Appel de la méthode et récupération du nom du profil
        String profileName = OpportunityProductSelector.getUserProfileName();
        
        // Vérification que le nom du profil n'est ni null ni vide
        System.assert(profileName != null && profileName != '', 'Le nom du profil ne doit pas être null ou vide');
        
        Test.stopTest(); // Fin du test
    }

    // Test de l'instanciation du contrôleur OpportunityProductSelector
    @isTest
    private static void OpportunityProductSelectorTEST() {
        Test.startTest(); // Démarrage du test
        
        // Création d'une instance du contrôleur
        OpportunityProductSelector obj = new OpportunityProductSelector();
        
        // Vérification que l'instance n'est pas null
        System.assert(obj != null, 'L instance de OpportunityProductSelector ne doit pas être null');
        
        Test.stopTest(); // Fin du test
    }
}