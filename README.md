# Selection-Table-Aura-Component-for-Salesforce-Flows
Lightning Aura Component which can be embedded inside Lightning flows.

These are the input and outputs of the component from and to the Flow.

Inputs:

- ObjectAPIName - The object API name to show records from that object.
- WhereClause - The filtering criteria for the records to show in the table.
- FieldSetName - The API name of the Field Set of fields to show. The field set need to exist for the given object.
- NoSelection - Should a user be able to select a record from the list or the list displays records only.
- SingleSelection - Should a user be able to only select a single record from the list of records.
- MultipleSelection - Should a user be able to select mulitple records from the list of records.
- NoRecordsMessage - The message to display if there are no records to show.
- Sorting - Should the user have the ability to sort the list of records.
- Pagination - Should the user have the ability to paginate the list of records.
- Searching - Should the user have the ability to search the list of records.

Output:

- SelectedRecordId - If "SingleSelection" or "MultipleSelection" is enabled, the user can select one or more of the records. The selected record Id would be the output from this component.