function AddUsersFromCsv ($Path, $AD, $Dom, $OU) {
    $csv = Import-Csv  $path -Delimiter ",";
    ForEach ($ligne in $csv) {
        $userName = ("U_" + $ligne.Feature + $ligne.Role);
        $groupName = ("G_" + $ligne.Feature + $ligne.Role);
        $groupDescription = ($ligne.GroupDescription);
        $userDescription = ($ligne.userDescription);
        AddUser -userName $userName -userDescription $userDescription -AD $AD -Dom $Dom -OU $OU;
        Write-Host "$userName created ";
        AddGroup -groupName $groupName -groupDescription $groupDescription -userName $userName -AD $AD -Dom $Dom -OU $OU;
        Write-Host "$groupName created ";
    }
}
function AddUser ($userName, $userDescription, $AD, $Dom, $OU) {
    try { 
        New-ADUser -Name $userName -GivenName $userName -SamAccountName $userName -UserPrincipalName "$userName@$AD.$dom" -Path "OU=$OU,DC=$AD,DC=$Dom" -Description $userDescription -AccountPassword(ConvertTo-SecureString "P@ssword" -AsPlainText -Force) -Enabled $true -PasswordNeverExpires $true;
    }
    catch {     
        Write-Host  "$userName : " $_.Exception.Message;
    }
}
function AddGroup($groupName, $groupDescription, $userName, $AD, $Dom, $OU) {
    try { 
        NEW-ADGroup -Name $groupName -Description $groupDescription  -SamAccountName $groupName -Path "OU=$OU,DC=$AD,DC=$Dom" –groupscope Global; 
    }
    catch {     
        Write-Host  "$GroupName : " $_.Exception.Message;
    }
    try {
        Add-ADGroupMember -Identity $GroupName -Member $userName 
    }
    catch {     
        Write-Host  "Add user TO GroupName: " $_.Exception.Message;
    }
}

AddUsersFromCsv -Path .\users.csv -AD DC -Dom Corp -OU "SharePoint Users"