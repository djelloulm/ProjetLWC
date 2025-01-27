@isTest
private class OppProdViewerControllerTEST {
    
    // Test de la méthode getOpportunities()
    @isTest
    private static void getOpportunitiesTEST() {
        Database.SaveResult dsr; // Variable pour stocker le résultat de l'insertion
        OpportunityLineItem drOpportunityLineItem; // Déclaration d'un objet OpportunityLineItem
        
        // Création d'une Opportunity Line Item avec un ID d'opportunité fictif et une quantité
        drOpportunityLineItem = new OpportunityLineItem(OpportunityId = '00kx00000000000AAA', Quantity = 123);
        
        // Tentative d'insertion de l'OpportunityLineItem en base de données (sans arrêt du test)
        dsr = Database.insert(drOpportunityLineItem, false);
        
        Test.startTest(); // Démarrage du test unitaire
        
        try {
            // Appel de la méthode getOpportunities() et récupération des OpportunityLineItems
            List<OpportunityLineItem> lineItems = OppProdViewerController.getOpportunities(null);
            
            // Vérification que la liste retournée n'est pas null
            System.assert(lineItems != null, 'La liste des OpportunityLineItems ne doit pas être null');
        } catch (Exception e) {
            // Si une exception est levée, le test échoue
            System.assert(false, 'Une exception ne devrait pas être levée : ' + e.getMessage());
        }
        
        Test.stopTest(); // Fin du test unitaire
    }

    // Test de la méthode getUserProfileNameController() qui retourne le nom du profil de l'utilisateur connecté
    @isTest(SeeAllData=true)
    private static void getUserProfileNameControllerTEST() {
        Test.startTest(); // Démarrage du test
        
        // Appel de la méthode et récupération du nom du profil
        String profileName = OppProdViewerController.getUserProfileNameController();
        
        // Vérification que le nom du profil n'est ni null ni vide
        System.assert(profileName != null && profileName != '', 'Le nom du profil ne doit pas être null ou vide');
        
        Test.stopTest(); // Fin du test
    }

    // Test de l'instanciation du contrôleur OppProdViewerController
    @isTest
    private static void OppProdViewerControllerTEST() {
        Test.startTest(); // Démarrage du test
        
        // Création d'une instance du contrôleur
        OppProdViewerController obj = new OppProdViewerController();
        
        // Vérification que l'instance n'est pas null
        System.assert(obj != null, 'L\'instance de OppProdViewerController ne doit pas être null');
        
        Test.stopTest(); // Fin du test
    }
}