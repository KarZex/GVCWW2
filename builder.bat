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
echo Addon files have been built and renamed successfully.
pause