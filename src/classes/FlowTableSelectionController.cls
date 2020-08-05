public class FlowTableSelectionController  { 
	@AuraEnabled
    public static ApexMethodResult getRecordsToDisplayInTable(String sobject_name, String field_set_name, String where_clause){
        ApexMethodResult apex_method_result = new ApexMethodResult();
        try {
			Schema.FieldSet field_set = getFieldSetForObject(sobject_name, field_set_name);
			apex_method_result.setFieldLabels(field_set);
			String query = getQueryForObjectFieldSetAndWhereClause(sobject_name, field_set, where_clause);
			List<sObject> table_records = Database.query(query);
			for(sObject table_record : table_records){
				TableRow table_row = new TableRow(table_record, field_set);
				apex_method_result.TableRows.add(table_row);
			}
        } catch(Exception e){
            apex_method_result.handleException(e);
        }
        return apex_method_result;
    }

	private static Schema.FieldSet getFieldSetForObject(String sobject_name, String field_set_name){
		 Map<String, Schema.SObjectType> global_describe = Schema.getGlobalDescribe();
		if(!global_describe.containsKey(sobject_name)){
			throw new FlowTableSelectionException('Bad object specified ' + sobject_name);
		}
		Schema.SObjectType sobject_type = global_describe.get(sobject_name);
		Schema.DescribeSObjectResult sobject_type_describe = sobject_type.getDescribe();
		if(!sobject_type_describe.FieldSets.getMap().containsKey(field_set_name)){
			throw new FlowTableSelectionException('Can\'t find fieldset ' + field_set_name);
		}
		return sobject_type_describe.FieldSets.getMap().get(field_set_name);
	}

	private static String getQueryForObjectFieldSetAndWhereClause(String sobject_name, Schema.FieldSet field_set, String where_clause){
		List<String> fields_api_name = new List<String>();
		for(Schema.FieldSetMember fieldset_member : field_set.getFields()){
			fields_api_name.add(fieldset_member.getFieldPath());
		}
		String query = 'SELECT ' + String.join(fields_api_name, ', ') + ' FROM ' + sobject_name;
		if(!String.isBlank(where_clause)){
			query += ' WHERE ' + where_clause;
		}
		return query;
	}

	@TestVisible
    private class ApexMethodResult {
        @AuraEnabled
        public List<TableRow> TableRows;
		@AuraEnabled
        public List<String> FieldLabels;
        @AuraEnabled
        public Boolean Success;
        @AuraEnabled
        public String ErrorMessage;

        public ApexMethodResult(){
			this.Success = true;
            this.TableRows = new List<TableRow>();
            this.FieldLabels = new List<String>();
        }

		public void handleException(Exception e){
			this.Success = false;
			this.ErrorMessage = e.getMessage();
		}

		public void setFieldLabels(Schema.FieldSet field_set){
			for(Schema.FieldSetMember fieldset_member : field_set.getFields()){
				this.FieldLabels.add(fieldset_member.getLabel());
			}
		}
    }

	@TestVisible
    private class TableRow {
		@AuraEnabled
        public List<Field> Fields;
		@AuraEnabled
        public String RecordId;
        @AuraEnabled
        public Boolean ValueChecked;
		
		public TableRow(sObject record, Schema.FieldSet field_set){
			this.RecordId = record.Id;
            this.ValueChecked = false;
			this.Fields = new List<Field>();
			for(Schema.FieldSetMember fieldset_member : field_set.getFields()){
				Field table_row_field = new Field(record, fieldset_member, this.Fields.isEmpty());
				this.Fields.add(table_row_field);
			}
		}
	}

	@TestVisible
    private class Field {
		@AuraEnabled
        public String Value;
		@AuraEnabled
        public String FieldType;
		@AuraEnabled
        public Boolean FirstField;
	
		public Field(sObject record, Schema.FieldSetMember fieldset_member, Boolean first_field){
			this.FirstField = first_field;
			String field_api_name = fieldset_member.getFieldPath();
			this.FieldType = String.valueOf(fieldset_member.getType());
			if(record.get(field_api_name) != null){
				if(this.FieldType == 'DATE'){
					this.Value = ((Date)record.get(field_api_name)).format();
				} else if (this.FieldType == 'DATETIME'){
					this.Value = ((DateTime)record.get(field_api_name)).format();
				} else if (this.FieldType == 'PERCENT'){
					this.Value = String.valueOf((Decimal)record.get(field_api_name) / 100.0);
				} else {
					this.Value = String.valueOf(record.get(field_api_name));
				}
			}
		}
	}

	@TestVisible
    private class FlowTableSelectionException extends Exception {}
}