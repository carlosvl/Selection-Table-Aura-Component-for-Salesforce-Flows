# Selection-Table-Aura-Component-for-Salesforce-Flows
Lightning Aura Component which can be embedded inside Lightning flows.

These are the input and outputs of the component from and to the Flow.

Inputs:

- ObjectAPIName - The object API name to show records from that object.
- WhereClause - The filtering criteria for the records to show in the table
- FieldSetName - The API name of the Field Set of fields to show. The field set need to exist for the given object.
- AllowSelection - Should a user be able to select a record from the list or the list displays records only.
- NoRecordsMessage - The message to display if there are no records to show

Output:

- SelectedRecordId - If "AllowSelection" is enabled, the user can select one of the records. The selected record Id would be the output from this component.