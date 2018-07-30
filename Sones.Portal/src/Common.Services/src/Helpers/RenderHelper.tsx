import { initializeIcons } from "@uifabric/icons";
import ReactDOM from "react-dom";
import { loadTheme } from "office-ui-fabric-react";
import { theme } from "../../../Common.Components/src/Index";
import "url-search-params-polyfill";

export function RenderComponent(component: JSX.Element): void {
    loadTheme(theme);
    initializeIcons();
    document.addEventListener("DOMContentLoaded", () => {
        SP.SOD.executeFunc("sp.js", "SP.ClientContext", () => {
            ReactDOM.render(component, document.getElementById("app"));
        });
    });
}
