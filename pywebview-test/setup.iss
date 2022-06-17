#define MyAppName "Gozeon Gihtub"
#define MyAppVersion "1.5"
#define MyAppExeName "main.exe"
#define MYAppDist "dist\main"

[Setup]
AppName={#MyAppName}
AppVersion={#MyAppVersion}
WizardStyle=modern
DefaultDirName={autopf}\Gozeon Gihtub
DefaultGroupName=Gozeon Gihtub
UninstallDisplayIcon={app}\{#MyAppExeName}
Compression=lzma2
SolidCompression=yes
OutputDir=setup
OutputBaseFilename={#MyAppName}.{#MyAppVersion}-setup


[Files]
Source: "{#MYAppDist}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs
Source: "readme.md"; DestDir: "{app}"; Flags: isreadme

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}";
Name: "startupicon"; Description: "Start application when user logs in"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon
Name: "{commonstartup}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: startupicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent