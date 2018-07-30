$(document).ready(function () {
    var queryTemplate = "<View><Query><Where><Eq><FieldRef Name='ParentMenu' LookupId='TRUE' /><Value Type='Lookup'>{ID}</Value></Eq></Where></Query><OrderBy><FieldRef Name='Ordre' Ascending='True' /></OrderBy></View>";
    var queryTemplate2 = "<View><Query><Where><IsNull><FieldRef Name='ParentMenu' LookupId='TRUE' /></IsNull></Where></Query><OrderBy><FieldRef Name='Ordre' Ascending='True' /></OrderBy></View>";

    var GetChildren = function (id, domElement, level) {
        if (level == 3)
            return;
        var viewXml = "";
        if (id !== 0) { viewXml = queryTemplate.replace("{ID}", id); }
        else { viewXml = queryTemplate2; }
        $.ajax({
            url: location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + "/sites/Config/_api/Web/Lists/getByTitle('Liens de navigation')/GetItems",
            type: "post",
            dataType: "json",
            data: JSON.stringify({
                query: {
                    __metadata:
                    {
                        type: "SP.CamlQuery"
                    },
                    ViewXml: viewXml
                }
            }),
            headers: {
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                'content-type': 'application/json;odata=verbose',
                'accept': 'application/json;odata=verbose'
            },
            success: function (result, statut) {
                result = result.d.results;
                var MenuDom;
                if (typeof (domElement) === "undefined") {
                    $(".o365cs-nav-centerAlign")
                        .first()
                        .html("<ul class='menu' style='font-size:16px;'></ul>");
                    MenuDom = $(".o365cs-nav-centerAlign .menu")
                        .first();
                } else {
                    domElement.append("<ul></ul>");
                    MenuDom = domElement.children("ul").first();
                }
                result.forEach(function (element) {

                    var item = "<li class='Nav-Menu-Item' id='{ID}' ><a href='{Link}'>{Title}</a></li>"
                        .replace('{ID}', element.ID)
                        .replace('{Title}', element.Title)
                        .replace('{Link}', element.Link);
                    MenuDom.append(item);
                    var selector = '.Nav-Menu-Item#{ID}'.replace('{ID}', element.ID);
                    level++;
                    GetChildren(element.ID, $(selector), level);
                });

            },
            error: function (resultat, statut, erreur) {
            }
        });
    };
    GetChildren(0, undefined, 0);
});