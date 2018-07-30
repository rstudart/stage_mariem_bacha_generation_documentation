/** Caml Query for property extraction */
const PropertyQuery: string = "<View>" +
    "<Query>" +
    "<Where>" +
    "<Eq>" +
    "<FieldRef Name='Key' />" +
    "<Value Type='Text'>{0}</Value>" +
    "</Eq>" +
    "</Where>" +
    "</Query>" +
    "<ViewFields>" +
    "<FieldRef Name='Value' />" +
    "</ViewFields>" +
    "</View>";

const UserDirectionQuery: string =  "<View>" +
"<Query>" +
"<Where>" +
"<Eq>" +
"<FieldRef Name='Employe' LookupId='TRUE' />" +
"<Value Type='Integer'><UserID/></Value>" +
"</Eq>" +
"</Where>" +
"</Query>" +
"</View>";
export { PropertyQuery ,UserDirectionQuery};

export const TemplateQuery:string = "<View>" +
"<Query>" +
"<Where>" +
"<Eq>" +
"<FieldRef Name='IdentifiantTemplate' />" +
"<Value Type='Text'>{0}</Value>" +
"</Eq>" +
"</Where>" +
"</Query>" +
"</View>";