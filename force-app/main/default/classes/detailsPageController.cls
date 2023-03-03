public class detailsPageController {
    //
    ///
    //Get all Expense__c records
    @AuraEnabled(cacheable=true)
    public static DataWrapper getAllWorkTypes(String fieldsSearchKey , integer year , String value , integer month){
        try{
            System.debug('Check1');
            System.debug('year :'+year);
            System.debug('month :'+month);
            List<Expense__c> ExpenseHolderList = new List<Expense__c>();
            DataWrapper data = new DataWrapper();
            //List<Expense__c> workTypeList = new List<Expense__c>();
                if( ( fieldsSearchKey == null || String.isEmpty(fieldsSearchKey) ) && ( value == 'all' ) ){
                    data.expenseRecord = getRecords(year , month);
                }else if( ( fieldsSearchKey == null || String.isEmpty(fieldsSearchKey) ) && ( value != 'all' ) ){
                        ExpenseHolderList = getRecords(year , month);
                        data.expenseRecord = getRecordsForCombobox(ExpenseHolderList , value);
                }else if (( fieldsSearchKey != null || !String.isEmpty(fieldsSearchKey) )  ){
                    data.expenseRecord = getRecordsBySearchKey(fieldsSearchKey , year , value , month);
                }
                data.budgetForCategoryRecord = getBudgetForCategoryRecords(year,month);
                System.debug('data.budgetForCategoryRecord :'+data.budgetForCategoryRecord);

                return data; 
        }catch(exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    //SOQL of Expense__c
    private static List<Expense__c> getRecords(integer year , integer month){
        try{
            String query ;
            integer startYear;
            integer endYear;
            integer startMonth;
            integer endMonth;
            integer startDay;
            integer endDay;
            if(month>=1 && month<12){
                startYear = year;
                endYear = year;
                startMonth = month;
                endMonth = month+1 ;
                startDay=10;
                endDay=9 ;
                query ='SELECT Id, Name, Expense_Date__c, Cost__c, Category__r.Name, Description__c FROM Expense__c WHERE (Expense_Year__c =:startYear AND Expense_Month__c =:startMonth AND Expense_Day__c >=:startDay) OR (Expense_Year__c =:endYear AND Expense_Month__c =:endMonth AND Expense_Day__c <=:endDay) ORDER BY Name ASC';
            }
            if(month==12){
                startYear = year;
                endYear = year+1;
                startMonth = 12;
                endMonth = 1 ;
                startDay=10;
                endDay=9 ;
                query ='SELECT Id, Name, Expense_Date__c, Cost__c, Category__r.Name, Description__c FROM Expense__c WHERE (Expense_Year__c =:startYear AND Expense_Month__c =:startMonth AND Expense_Day__c >=:startDay) OR (Expense_Year__c =:endYear AND Expense_Month__c =:endMonth AND Expense_Day__c <=:endDay) ORDER BY Name ASC';
            }    
            //String query ='SELECT Id, Name, Expense_Date__c, Cost__c, Category__r.Name, Description__c FROM Expense__c WHERE Expense_Year__c =:year ORDER BY Name ASC';
            return database.query(query);
        }catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    } 

        //SOQL of Budget_For_Category__c
        private static List<Budget_For_Category__c> getBudgetForCategoryRecords(integer year ,  integer month){
            try{
                String monthString = String.valueOf(month);
                String query ='SELECT Id, Category__r.Name, Category_Budget__c, Month__c, Name, Year__c FROM Budget_For_Category__c WHERE Year__c=:year AND Month__c=:monthString ORDER BY Name ASC';
                return database.query(query);
            }catch (Exception e) {
                System.debug('e.getMessage() :'+e.getMessage());
                throw new AuraHandledException(e.getMessage());
            }
        } 

    //SOQL Of Expense__c with search
    private static List<Expense__c> getRecordsBySearchKey(String fieldsSearchKey , integer year , String value , integer month){
        List<Expense__c> records = new List<Expense__c>();
        System.debug('fieldsSearchKey :'+fieldsSearchKey);
        map<String,String> categoryIdToCategoryName = new map<String,String>();
        for(Expense__c ex : [SELECT Id, Category__c, Category__r.Name FROM Expense__c ]){
            categoryIdToCategoryName.put(ex.Category__c , ex.Category__r.Name);
        }
        System.debug('categoryIdToCategoryName :'+categoryIdToCategoryName);
        integer counter =1;
        List<Expense__c> recordsBySearchKey = new List<Expense__c>();
        List<String> custimFields = new List<String>();
        custimFields.add('Id');
        custimFields.add('Name');
        custimFields.add('Expense_Date__c');
        custimFields.add('Cost__c');
        custimFields.add('Category__c');
        custimFields.add('Description__c');
        List<Expense__c> records2 = getRecords(year , month);
        if(value!='all'){
            records = getRecordsForCombobox(records2 , value);
        }else{
            records = records2;
        }    
        for(Expense__c record : records){
            for(String fieldMember : custimFields){
                counter=counter+1;
                if(record.get(fieldMember) != null){
                    String fieldValueStr='';
                    if(fieldMember!='Category__c'){
                        fieldValueStr = String.valueof(record.get(fieldMember));
                    }else{
                        fieldValueStr = categoryIdToCategoryName.get(String.valueof(record.get(fieldMember)));
                    }
                    if(fieldValueStr.containsIgnoreCase(fieldsSearchKey)){
                        recordsBySearchKey.add(record);                  
                        break;
                    }    
                }    
            }             
        }
        System.debug('recordsBySearchKey :'+recordsBySearchKey);
        return recordsBySearchKey;
    }
    
    private static List<Expense__c> getRecordsForCombobox(List<Expense__c> records , String value){
        List<Expense__c> newRecords = new List<Expense__c>();
        for(Expense__c expr : records){
            if(expr.Category__r.Name==value){
                newRecords.add(expr);
            }
        }
        return newRecords;
    } 
    
    public class DataWrapper {
        @AuraEnabled
        public List<Budget_For_Category__c> budgetForCategoryRecord {get;set;}
        @AuraEnabled
        public List<Expense__c> expenseRecord {get;set;}
    }
}
