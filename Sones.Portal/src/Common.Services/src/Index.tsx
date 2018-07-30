import { DayPickerStrings } from "./Constants/FrenchDatePickerText";
import { IService } from "./Services/IService";
import { ServicesStimulation } from "./Services/ServicesImplementations/ServicesStimulation";
import { ISharePointServices } from "./Services/ISharepointServices";
import { SharePointOperations } from "./Services/ServicesImplementations/SharepointServices";
import * as helper from "./Helpers/Helpers";
import { RenderComponent } from "./Helpers/RenderHelper";

let Services: IService = new ServicesStimulation();
let SharePointServices: ISharePointServices = new SharePointOperations();
export { DayPickerStrings, Services, IService, SharePointServices, ISharePointServices, helper, RenderComponent };
