@isTest
private class AccountCasesControllerTEST{
    @isTest
    private static void findCasesBySubjectTEST(){
        Database.SaveResult dsr;
        Case drCase;
        drCase=new Case(AccountId='500x00000000000AAA',Subject='OpenClassRooms Test Class');
        dsr=Database.insert(drCase,false);
        Test.startTest();
        try{
        AccountCasesController.findCasesBySubject('',dsr.getId());
        }catch(Exception e){}
        Test.stopTest();
    }
    @isTest
    private static void AccountCasesControllerTEST(){
        AccountCasesController obj = new AccountCasesController();
    }
}
