<%-- _lcid="1036" _version="16.0.4303" _dal="1" --%>
<%-- _LocalBinding --%>
<%@ Page language="C#" MasterPageFile="~masterurl/default.master"    Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint,Version=16.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" meta:progid="SharePoint.WebPartPage.Document" meta:webpartpageexpansion="full"  %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitle" runat="server">
    BonDeCommande
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
    <meta name="GENERATOR" content="Microsoft SharePoint" />
    <meta name="ProgId" content="SharePoint.WebPartPage.Document" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="CollaborationServer" content="SharePoint Team Web Site" />
   <title>BonDeCommande</title>
    <script type="text/javascript" src="/sites/config/Code/BonDeCommande/app-entry.js"></script>
    <script type="text/javascript" src="/sites/config/Code/BonDeCommande/node_modules-bundle.js"></script>
    <script type="text/javascript" src="/sites/config/Code/BonDeCommande/Common.Components.js"></script>
    <script type="text/javascript" src="/sites/config/Code/BonDeCommande/Common.Services.js"></script>
    <script type="text/javascript" src="/sites/config/Code/BonDeCommande/main.js"></script>
    <link rel="stylesheet" href="/sites/config/Code/css/fabric.min.css">
        <SharePoint:ScriptBlock runat="server">
        var navBarHelpOverrideKey = "WSSEndUser";
    </SharePoint:ScriptBlock>
    <SharePoint:StyleBlock runat="server">
        body #s4-leftpanel { display:none; } .s4-ca { margin-left:0px; }
    </SharePoint:StyleBlock>
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderSearchArea" runat="server">
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderPageDescription" runat="server">
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitleInTitleArea" runat="server">
    BonDeCommande
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
    <div class="ms-hide">
        <WebPartPages:WebPartZone runat="server" title="loc:TitleBar" id="TitleBar" AllowLayoutChange="false" AllowPersonalization="false"
            Style="display:none;">
            <ZoneTemplate>
                <WebPartPages:TitleBarWebPart runat="server" HeaderTitle="bon de commande" Title="Barre de titre de la page de composants WebPart"
                    FrameType="None" SuppressWebPartChrome="False" Description="" IsIncluded="True" ZoneID="TitleBar" PartOrder="2"
                    FrameState="Normal" AllowRemove="True" AllowZoneChange="True" AllowMinimize="False" AllowConnect="True" AllowEdit="True"
                    AllowHide="True" IsVisible="True" DetailLink="" HelpLink="" HelpMode="Modeless" Dir="Default" PartImageSmall=""
                    MissingAssembly="Impossible d&#39;importer ce composant WebPart." ImportErrorMessage="Impossible d&#39;importer ce composant WebPart."
                    PartImageLarge="" IsIncludedFilter="" ExportControlledProperties="True" ConnectionID="00000000-0000-0000-0000-000000000000"
                    ID="g_25010686_a2e5_458e_a0e4_a7661e28e465" AllowClose="False" ChromeType="None" ExportMode="All" __MarkupType="vsattributemarkup"
                    __WebPartId="{25010686-A2E5-458E-A0E4-A7661E28E465}" WebPart="true" Height="" Width=""></WebPartPages:TitleBarWebPart>

            </ZoneTemplate>
        </WebPartPages:WebPartZone>
    </div>
    <div id="app"></div>
    <table class="ms-core-tableNoSpace ms-webpartPage-root" width="100%">
        <tr>
            <td id="_invisibleIfEmpty" name="_invisibleIfEmpty" valign="top" width="100%">
                <WebPartPages:WebPartZone runat="server" Title="loc:FullPage" ID="FullPage" FrameType="TitleBarOnly">
                    <ZoneTemplate></ZoneTemplate>
                </WebPartPages:WebPartZone>
            </td>
        </tr>
        <SharePoint:ScriptBlock runat="server">if(typeof(MSOLayout_MakeInvisibleIfEmpty) == "function") {MSOLayout_MakeInvisibleIfEmpty();}</SharePoint:ScriptBlock>
    </table>
</asp:Content>