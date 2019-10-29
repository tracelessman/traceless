### 原生更新

> ios: info.plist CFBundleShortVersionString
android: app/build.gradle versionName

# fix
node_modules/react-native/React/Base/RCTModuleMethod.mm,

```
static BOOL RCTParseUnused(const char **input)
{
  return RCTReadString(input, "__attribute__((unused))") ||
         RCTReadString(input, "__attribute__((__unused__))") ||
         RCTReadString(input, "__unused");
}

```
