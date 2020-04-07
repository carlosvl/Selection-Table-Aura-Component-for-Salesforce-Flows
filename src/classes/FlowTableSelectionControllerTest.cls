@isTest
private class FlowTableSelectionControllerTest {

	@testSetup static void setupData() {
		Opportunity test_opportunity = new Opportunity(CloseDate = Date.today(), Name ='Test Opportunity', StageName = 'Prospecting');
		insert test_opportunity;
        List<Quote> test_quotes = new List<Quote>();
        for(Integer i = 0; i < 3; i++) {
            Quote test_quote = new Quote(Name = 'Test Quote ' + i, OpportunityId = test_opportunity.Id);
			test_quotes.add(test_quote);
        }
        insert test_quotes;        
    }

    @isTest
    static void testGetRecordsToDisplayInTableReturnTableRowsForOpportunityQuotes() {
		Opportunity test_opportunity = [SELECT Id FROM Opportunity];
		String where_clause = 'OpportunityId = \'' + test_opportunity.Id + '\'';
		String sobject_name = 'Quote';
		String field_set_name = 'QuoteFieldForFlowTable';

        Test.startTest();
            FlowTableSelectionController.ApexMethodResult result = FlowTableSelectionController.getRecordsToDisplayInTable(sobject_name, field_set_name, where_clause);
        Test.stopTest();

        System.assertEquals(true, result.Success);
		System.assertEquals(3, result.TableRows.size());
    }

	@isTest
    static void testGetRecordsToDisplayInTableReturnErrorForBadOjbect() {
		Opportunity test_opportunity = [SELECT Id FROM Opportunity];
		String where_clause = 'OpportunityId = \'' + test_opportunity.Id + '\'';
		String sobject_name = 'Bad';
		String field_set_name = 'QuoteFieldForFlowTable';

        Test.startTest();
            FlowTableSelectionController.ApexMethodResult result = FlowTableSelectionController.getRecordsToDisplayInTable(sobject_name, field_set_name, where_clause);
        Test.stopTest();

        System.assertEquals(false, result.Success);
		System.assertEquals('Bad object specified Bad', result.ErrorMessage);
		System.assertEquals(0, result.TableRows.size());
    }

	@isTest
    static void testGetRecordsToDisplayInTableReturnErrorForBadFieldSet() {
		Opportunity test_opportunity = [SELECT Id FROM Opportunity];
		String where_clause = 'OpportunityId = \'' + test_opportunity.Id + '\'';
		String sobject_name = 'Quote';
		String field_set_name = 'Bad';

        Test.startTest();
            FlowTableSelectionController.ApexMethodResult result = FlowTableSelectionController.getRecordsToDisplayInTable(sobject_name, field_set_name, where_clause);
        Test.stopTest();

        System.assertEquals(false, result.Success);
		System.assertEquals('Can\'t find fieldset Bad', result.ErrorMessage);
		System.assertEquals(0, result.TableRows.size());
    }

	@isTest
    static void testGetRecordsToDisplayInTableReturnNoResultsQuotes() {
		Opportunity test_opportunity = [SELECT Id FROM Opportunity];
		String where_clause = 'OpportunityId = \'\'';
		String sobject_name = 'Quote';
		String field_set_name = 'QuoteFieldForFlowTable';

        Test.startTest();
            FlowTableSelectionController.ApexMethodResult result = FlowTableSelectionController.getRecordsToDisplayInTable(sobject_name, field_set_name, where_clause);
        Test.stopTest();

        System.assertEquals(true, result.Success);
		System.assertEquals(0, result.TableRows.size());
    }

}