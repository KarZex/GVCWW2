@echo off
rd /S /Q output
mkdir output
cd behavior_packs
mkdir GVCWW2BedrockAddon
xcopy /Y /E .\GVCWW2Bedrock .\GVCWW2BedrockAddon
cd ..
cd resource_packs
mkdir GVCWW2BedrockAddon
xcopy /Y /E .\GVCWW2Bedrock .\GVCWW2BedrockAddon
cd ..
python builder.py
"C:\Program Files\7-Zip\7z.exe" a -tzip ./output/GVCWW2BedrockAddonB.zip .\behavior_packs\GVCWW2BedrockAddon
"C:\Program Files\7-Zip\7z.exe" a -tzip ./output/GVCWW2BedrockAddonR.zip .\resource_packs\GVCWW2BedrockAddon
rename output\GVCWW2BedrockAddonB.zip GVCWW2BedrockAddonB.mcpack
rename output\GVCWW2BedrockAddonR.zip GVCWW2BedrockAddonR.mcpack
rd /S /Q behavior_packs\GVCWW2BedrockAddon
rd /S /Q resource_packs\GVCWW2BedrockAddon
del output\GVCWW2BedrockAddonB.zip
del output\GVCWW2BedrockAddonR.zip
echo Addon files have been built and renamed successfully.
pause