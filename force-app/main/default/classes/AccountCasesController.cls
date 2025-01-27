public with sharing class AccountCasesController {

    @AuraEnabled(Cacheable=true)
    public static List<Case> findCasesBySubject(String subject, Id accountId) {
        // Vérifier que le paramètre 'subject' est bien fourni
        if (String.isEmpty(subject)) {
            throw new AuraHandledException('Le sujet ne peut pas être vide.');
        }

        // Ajouter les jokers (%) autour du sujet pour la recherche partielle
        String subjectFilter = '%' + subject + '%';  // Ici, on ajoute les jokers automatiquement

        // Requête SOQL pour récupérer les cas associés à l'Account et avec un sujet contenant le mot spécifié
        List<Case> cases = [SELECT Id, CaseNumber, Subject, Status, Priority 
                            FROM Case 
                            WHERE Subject LIKE :subjectFilter   // La recherche est effectuée avec LIKE et les jokers
                            AND AccountId = :accountId];

        // Retourner la liste des Cases trouvés
        return cases;
    }
}