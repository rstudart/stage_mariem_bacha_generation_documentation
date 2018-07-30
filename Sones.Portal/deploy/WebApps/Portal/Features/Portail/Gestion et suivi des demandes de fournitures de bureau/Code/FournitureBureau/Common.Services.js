webpackJsonp([3],{13:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0),i=r(195);t.DayPickerStrings=i.DayPickerStrings;var o=r(196),s=r(198),a=n.__importStar(r(527));t.helper=a;var u=r(528);t.RenderComponent=u.RenderComponent;var c=new o.ServicesStimulation;t.Services=c;var l=new s.SharePointOperations;t.SharePointServices=l},195:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.DayPickerStrings={months:["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],shortMonths:["Jan","Fév","Mar","Avr","Mai","Jun","Juil","Août","Sep","Oct","Nov","Déc"],days:["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],shortDays:["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"],goToToday:"Aujourd'hui",prevMonthAriaLabel:"Mois précédent",nextMonthAriaLabel:"Mois prochain",prevYearAriaLabel:"Année précédente",nextYearAriaLabel:"Année prochaine",isRequiredErrorMessage:"Champ requis.",invalidInputErrorMessage:"Format de date incorrect."}},196:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(197),i=function(){function e(){}return e.prototype.SearchUser=function(e,t){return new Promise(function(e){e([{Id:1,FullName:"Amine Bchir",Email:"bchiir@gmail.com"},{Id:2,FullName:"Ghassen Harrath",Email:"Ghassen@gmail.com"}])})},e.prototype.GetItemByID=function(e,t,r){return new Promise(function(e){e({Title:"Bon de Commande",Actions:[],Fields:[{FieldName:"CommandeNumber",Type:"TextFieldConfiguration",FieldConfiguration:{label:"Numero",required:!0,Validators:[{Name:"required"},{Name:"maxLength",Arg:5},{Name:"minLength",Arg:4}],Permissions:[{GroupName:"Groupe 1",GroupPermission:1},{GroupName:"Groupe 2",GroupPermission:[{State:"started",Permission:1}]}]}},{FieldName:"State",Type:"ChoiceConfiguration",FieldConfiguration:{label:"Etat",required:!0,multiSelect:!0,FieldDefinitionChoicesSrc:!0,Validators:[{Name:"required"}],ListUrl:"Lists/h",Column:"hh",Permissions:[{GroupName:"Groupe 1",GroupPermission:1},{GroupName:"Groupe 2",GroupPermission:2}]}},{FieldName:"Date",Type:"DatePickerConfiguration",FieldConfiguration:{label:"Date",isRequired:!0,Validators:[],Permissions:[{GroupName:"Groupe 1",GroupPermission:1},{GroupName:"Groupe 2",GroupPermission:2}]}},{FieldName:"people",Type:"PeoplePickerConfiguration",FieldConfiguration:{label:"people",required:!0,Validators:[{Name:"required"}],Permissions:[{GroupName:"Groupe 1",GroupPermission:1},{GroupName:"Groupe 2",GroupPermission:2}]}},{FieldName:"Fournisseur",Type:"ItemPickerConfiguration",FieldConfiguration:{label:"Fournisseur",required:!0,ListUrl:"Lists/Fournisseurs",DisplayedColumn:"nom",Validators:[{Name:"required"}],Permissions:[{GroupName:"Groupe 1",GroupPermission:1},{GroupName:"Groupe 2",GroupPermission:2}]}}]})})},e.prototype.GetNewItem=function(e){return new Promise(function(t){t({url:e})})},e.prototype.GetChoices=function(e,t,r){return new Promise(function(e){e(["a","b"])})},e.prototype.GetUserById=function(e){return new Promise(function(e){e({Id:1,FullName:"Amine Bchir",Email:"bchiir@gmail.com"})})},e.prototype.GetCurrentUserGroups=function(){return new Promise(function(e){e(["Groupe 1","Groupe 2"])})},e.prototype.GetItems=function(e,t,r){var i=(void 0===r?n.Sites[1]:n.Sites.filter(function(e){return e.SiteUrl===r})[0]).Lists.filter(function(e){return e.ListUrl===t})[0];return new Promise(function(t){t(i.Content.filter(function(t){return-1!==t.Name.indexOf(e)}))})},e}();t.ServicesStimulation=i},197:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Sites=[{SiteUrl:"Sites/Admin",Lists:[{ListUrl:"Lists/Config",Content:[{Key:"conf1",Value:"Conf1"},{Key:"conf2",Value:"Conf2"}]}]},{SiteUrl:"Sites/BonDeCommande",Lists:[{ListUrl:"Lists/Fournisseurs",Content:[{Id:1,Name:"ABS"},{Id:2,Name:"ABIS"},{Id:3,Name:"AEBS"}]}]}]},198:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0),i=r(6),o=r(507),s=n.__importDefault(r(508)),a=function(){function e(){this.ReadFileBase64=function(e){var t=new FileReader;return new Promise(function(r,n){t.onerror=function(){n("Error reading the file")},t.onloadend=function(){console.log("done"),r(t.result)},t.readAsDataURL(e)})},this.ReadArrayBuffer=function(e){var t=new FileReader;return new Promise(function(r,n){t.onerror=function(){n("Error reading the file")},t.onloadend=function(){console.log("done"),r(t.result)},t.readAsArrayBuffer(e)})}}return e.prototype.AddOrUpdateItem=function(e,t,r,i){return n.__awaiter(this,void 0,void 0,function(){var o,s,a;return n.__generator(this,function(n){switch(n.label){case 0:return void 0!==e.ID&&0!==e.ID?[3,2]:[4,this.GetNewItem(t,r,i)];case 1:return o=n.sent(),[3,4];case 2:return[4,this.GetItemById(t,e.ID,i)];case 3:o=n.sent(),n.label=4;case 4:return[4,this.GetFields(t,i)];case 5:for(s=n.sent().getEnumerator();s.moveNext();)a=s.get_current().get_internalName(),void 0!==e[a]&&"ID"!==a&&"Attachments"!==a&&o.set_item(a,e[a]);return[2,this.UpdateItem(o,i)]}})})},e.prototype.AttachFileToItem=function(e,t,r,i){return n.__awaiter(this,void 0,void 0,function(){var o,a,u,c,l;return n.__generator(this,function(n){switch(n.label){case 0:return n.trys.push([0,6,,7]),[4,this.GetListByUrl(e,i)];case 1:return o=n.sent(),void 0!==i?[3,3]:[4,this.GetCurrentSiteUrl()];case 2:i=n.sent(),n.label=3;case 3:return a=i+"/_api/web/lists/getbytitle('"+o.get_title()+"')/items("+t+")/AttachmentFiles/add(FileName='"+r.name+"')",[4,this.ReadArrayBuffer(r)];case 4:return u=n.sent(),c={headers:{Accept:"application/json; odata=verbose","content-type":"application/json; odata=verbose","X-RequestDigest":this.XRequestDigiest}},[4,s.default.post(a,u,c)];case 5:return n.sent(),[2,!0];case 6:throw l=n.sent(),{get_message:function(){return l}};case 7:return[2]}})})},e.prototype.GetAttatchementsUrls=function(e,t,r){return n.__awaiter(this,void 0,void 0,function(){var i,o;return n.__generator(this,function(n){switch(n.label){case 0:return i=this.GetContext(r),[4,this.GetItemById(e,t,r)];case 1:return o=n.sent(),[4,this.LoadItem(i,o.get_attachmentFiles())];case 2:return[2,n.sent().get_data().map(function(e){return e.get_serverRelativeUrl()})]}})})},e.prototype.GetChoices=function(e,t,r){return n.__awaiter(this,void 0,void 0,function(){var i;return n.__generator(this,function(n){switch(n.label){case 0:return[4,this.GetFields(e,r)];case 1:return i=n.sent(),[2,i.getByInternalNameOrTitle(t).get_choices()]}})})},e.prototype.GetColumnValue=function(e,t){return e.get_fieldValues()[t]},e.prototype.GetConfigurationProperty=function(e){var t=this,r=window.location,i=r.protocol+"//"+r.hostname;void 0!==r.port&&""!==r.port&&(i+=":"+r.port);var s=this.GetContext(i+"/sites/Config"),a=s.get_web().get_allProperties();return s.load(a),new Promise(function(r){s.executeQueryAsync(function(){return n.__awaiter(t,void 0,void 0,function(){var t,s,u,c;return n.__generator(this,function(n){switch(n.label){case 0:return t=a.get_fieldValues(),null==(s=t[e])?[3,1]:(r(s),[3,4]);case 1:return n.trys.push([1,3,,4]),[4,this.GetItems(String.format(o.PropertyQuery,e),"Lists/Config",i+"/sites/Config")];case 2:if((u=n.sent()).get_count()<=0)throw Error("404 Property not found");return r(u.get_item(0).get_fieldValues().Value),[3,4];case 3:throw c=n.sent(),Error(c);case 4:return[2]}})})},function(){return n.__awaiter(t,void 0,void 0,function(){var t,s;return n.__generator(this,function(n){switch(n.label){case 0:return n.trys.push([0,2,,3]),[4,this.GetItems(String.format(o.PropertyQuery,e),"Lists/Config",i+"/sites/Config")];case 1:if((t=n.sent()).get_count()<=0)throw Error("404 Property not found");return r(t.get_item(0).get_fieldValues().Value),[3,3];case 2:throw s=n.sent(),Error(s);case 3:return[2]}})})})})},e.prototype.GetContext=function(e){return void 0===e?SP.ClientContext.get_current():new SP.ClientContext(e)},e.prototype.GetCurrentUser=function(){return n.__awaiter(this,void 0,void 0,function(){var e,t;return n.__generator(this,function(r){switch(r.label){case 0:return e=this.GetContext(),t=e.get_web().get_currentUser(),[4,this.LoadItem(e,t)];case 1:return[2,r.sent()]}})})},e.prototype.GetCurrentUserDirection=function(){return n.__awaiter(this,void 0,void 0,function(){var e,t,r,i;return n.__generator(this,function(n){switch(n.label){case 0:return[4,this.GetItems(o.UserDirectionQuery,"Lists/Employes","/sites/Config")];case 1:return(e=n.sent()).get_count()>0?(t=e.get_data()[0],r=t.get_fieldValues().LookUpDirection,[4,this.GetItemById("Lists/Directions",r.get_lookupId(),"/sites/Config")]):[3,3];case 2:return[2,{CodeDirection:(i=n.sent().get_fieldValues()).CodeDirection,NameDirection:i.NameDirection}];case 3:throw console.error("L'utilisateur n'a pas été trouvé"),Error("L'utilisateur n'a pas été trouvé")}})})},e.prototype.GetCurrentUserGroups=function(){return n.__awaiter(this,void 0,void 0,function(){var e,t,r;return n.__generator(this,function(n){switch(n.label){case 0:return e=this.GetContext(),[4,this.GetCurrentUser()];case 1:return t=n.sent(),r=t.get_groups(),[4,this.LoadItem(e,r)];case 2:return[2,n.sent()]}})})},e.prototype.GetCurrentSiteUrl=function(){return n.__awaiter(this,void 0,void 0,function(){var e;return n.__generator(this,function(t){switch(t.label){case 0:return e=this.GetContext(),[4,this.LoadItem(e,e.get_site())];case 1:return[2,t.sent().get_url()]}})})},e.prototype.GetFields=function(e,t){return n.__awaiter(this,void 0,void 0,function(){var r,i,o;return n.__generator(this,function(n){switch(n.label){case 0:return[4,this.GetListByUrl(e,t)];case 1:return r=n.sent(),i=r.get_fields(),o=this.GetContext(t),[4,this.LoadItem(o,i)];case 2:return[2,n.sent()]}})})},e.prototype.GetItemById=function(e,t,r){return n.__awaiter(this,void 0,void 0,function(){var i,o,s;return n.__generator(this,function(n){switch(n.label){case 0:return i=this.GetContext(r),[4,this.GetListByUrl(e,r)];case 1:return o=n.sent(),s=o.getItemById(t),[4,this.LoadItem(i,s)];case 2:return[2,n.sent()]}})})},e.prototype.GetItems=function(e,t,r){return n.__awaiter(this,void 0,void 0,function(){var i,o,s,a;return n.__generator(this,function(n){switch(n.label){case 0:return i=this.GetContext(r),(o=new SP.CamlQuery).set_viewXml(e),[4,this.GetListByUrl(t,r)];case 1:return s=n.sent(),a=s.getItems(o),[4,this.LoadItem(i,a)];case 2:return[2,n.sent()]}})})},e.prototype.GetListByUrl=function(e,t){return n.__awaiter(this,void 0,void 0,function(){var r,i;return n.__generator(this,function(n){switch(n.label){case 0:return r=this.GetContext(t),e.startsWith("/")||(e="/"+e),[4,this.LoadItem(r,r.get_site())];case 1:return i=n.sent(),[4,this.LoadItem(r,r.get_web().getList(i.get_url()+e))];case 2:return[2,n.sent()]}})})},e.prototype.GetListByID=function(e,t){return n.__awaiter(this,void 0,void 0,function(){var r;return n.__generator(this,function(n){switch(n.label){case 0:return r=this.GetContext(t),[4,this.LoadItem(r,r.get_web().get_lists().getById(e))];case 1:return[2,n.sent()]}})})},e.prototype.GetListByTitle=function(e,t){return this.GetContext(t).get_web().get_lists().getByTitle(e)},e.prototype.GetLookupId=function(e,t){return e.get_fieldValues()[t].get_lookupId()},e.prototype.GetLookupValue=function(e,t){return this.GetColumnValue(e,t)},e.prototype.GetNewItem=function(e,t,r){return void 0===t&&(t=new SP.ListItemCreationInformation),n.__awaiter(this,void 0,void 0,function(){return n.__generator(this,function(n){switch(n.label){case 0:return[4,this.GetListByUrl(e,r)];case 1:return[2,n.sent().addItem(t)]}})})},e.prototype.GetTemplate=function(e){return n.__awaiter(this,void 0,void 0,function(){var t,r,i;return n.__generator(this,function(n){switch(n.label){case 0:return t=window.location,r=t.protocol+"//"+t.hostname,void 0!==t.port&&""!==t.port&&(r+=":"+t.port),[4,this.GetItems(String.format(o.TemplateQuery,e),"Lists/TemplateImpression",r+"/sites/Config")];case 1:if(0===(i=n.sent()).get_count())throw alert("Template d'impression inexistante"),Error("La template n'existe pas ");return[2,i.get_data()[0].get_fieldValues().Template]}})})},e.prototype.GetUserPersonProperties=function(e,t){return n.__awaiter(this,void 0,void 0,function(){var r,i,o;return n.__generator(this,function(n){switch(n.label){case 0:return r=this.GetContext(t),i=new SP.UserProfiles.PeopleManager(r),o=i.getPropertiesFor(e),[4,this.LoadItem(r,o)];case 1:return[2,n.sent()]}})})},e.prototype.GetUserProfileProperty=function(e,t,r){return n.__awaiter(this,void 0,void 0,function(){return n.__generator(this,function(n){switch(n.label){case 0:return[4,this.GetUserPersonProperties(t,r)];case 1:return[2,n.sent().get_userProfileProperties()[e]]}})})},e.prototype.GetUserValue=function(e,t){return this.GetColumnValue(e,t)},e.prototype.IsCurrentUserMemberOfGroup=function(e){return n.__awaiter(this,void 0,void 0,function(){var t,r;return n.__generator(this,function(n){switch(n.label){case 0:return[4,this.GetCurrentUserGroups()];case 1:for(t=n.sent(),r=t.getEnumerator();r.moveNext();)if(r.get_current().get_title()===e)return[2,!0];return[2,!1]}})})},e.prototype.UpdateItem=function(e,t){return n.__awaiter(this,void 0,void 0,function(){var r;return n.__generator(this,function(n){switch(n.label){case 0:return r=this.GetContext(t),e.update(),[4,this.LoadItem(r,e)];case 1:return[2,n.sent().get_id()]}})})},e.prototype.UploadFileToSiteDocuments=function(e,t,r){return n.__awaiter(this,void 0,void 0,function(){var i,o,s,a,u,c,l;return n.__generator(this,function(n){switch(n.label){case 0:return(i=new SP.FileCreationInformation).set_url(t+"-"+e.name),s=(o=i).set_content,u=(a=SP.Base64EncodedByteArray).bind,[4,this.ReadFileBase64(e)];case 1:return s.apply(o,[new(u.apply(a,[void 0,n.sent()]))]),[4,this.GetListByUrl("Documents",r)];case 2:return c=n.sent(),l=c.get_rootFolder().get_files().add(i),[4,this.LoadItem(this.GetContext(),l)];case 3:return[2,n.sent().get_serverRelativeUrl()]}})})},e.prototype.LoadItem=function(e,t){return n.__awaiter(this,void 0,void 0,function(){return n.__generator(this,function(r){return e.load(t),[2,new Promise(function(r,n){e.executeQueryAsync(function(){return r(t)},function(e,t){console.error(t),alert(t.get_message()),n(t)})})]})})},Object.defineProperty(e.prototype,"XRequestDigiest",{get:function(){return document.getElementById("__REQUESTDIGEST").value},enumerable:!0,configurable:!0}),n.__decorate([i.memoize],e.prototype,"GetContext",null),e}();t.SharePointOperations=a},507:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.PropertyQuery="<View><Query><Where><Eq><FieldRef Name='Key' /><Value Type='Text'>{0}</Value></Eq></Where></Query><ViewFields><FieldRef Name='Value' /></ViewFields></View>";t.UserDirectionQuery="<View><Query><Where><Eq><FieldRef Name='Employe' LookupId='TRUE' /><Value Type='Integer'><UserID/></Value></Eq></Where></Query></View>",t.TemplateQuery="<View><Query><Where><Eq><FieldRef Name='IdentifiantTemplate' /><Value Type='Text'>{0}</Value></Eq></Where></Query></View>"},527:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0);t.GetClassPropertiesOnly=function(e,t){try{for(var r=n.__values(Object.keys(e)),i=r.next();!i.done;i=r.next()){var o=i.value;e[o]=t[o]}}catch(e){s={error:e}}finally{try{i&&!i.done&&(a=r.return)&&a.call(r)}finally{if(s)throw s.error}}return e;var s,a}},528:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0),i=r(529),o=n.__importDefault(r(15)),s=r(6),a=r(26);r(579),t.RenderComponent=function(e){s.loadTheme(a.theme),i.initializeIcons(),document.addEventListener("DOMContentLoaded",function(){SP.SOD.executeFunc("sp.js","SP.ClientContext",function(){o.default.render(e,document.getElementById("app"))})})}}});