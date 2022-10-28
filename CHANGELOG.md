# Change Log:

**1.1.0-beta.2**
- Added onStop inputs and paths to UDP and HTTPServer boxes
- Better resolving and annoucement of network details
- Version now pulled from behavior properties. (Beta number still set within behavior)

**1.1.0-beta.1**
- Added support for Choregraphe 2.8 and NAO v6
- Removed references to State Library QLD as support has been transferred to STEMMechanics
- Fixed inconsistant version numbers in various places
- Fixed bug where logging in as `admin` would generate an error
- Fixed grammer around welcome to a location
- If the IP address of Ethernet and Wireless are the same, only announce one of the interfaces
- Added image to the project icon
- Updated code to remove depreciated fcntl library
- Overrides the websocket library in v6 NAOs which cause issues with backward compatibility
- Added support to using the virtual nao in Choregraphe 2.8
- Fixed issues with the UDP network code which could cause a crash in certain circumstances

**1.0.2**
- Fixed caching issues around language selection
- Fixed [otential error displayed when a script is exported without a name
- Fixed potential typecase issues with language codes
- When a language code is used and is not found, the app defaults back to English instead of generating an error

**1.0.1**
- Updated eslint dependency to 6.6.0

**1.0-beta.27**
- Fixed networking issues

**1.0-beta.26**
- Skipped

**1.0-beta.25**
- Added NAO Cadet license file.
- Option to quit NAO Cadet from the about dialog on tablets.

**1.0-beta.24**
- Help and more info links on the create/edit motion dialog have been fixed to actually show more the help window.
- Disconnect/timeout errors should now no longer be blocking unless neccessary. Insteadm a popup is displayed at the bottom of the screen saying the NAO is busy so please wait... (with a reconnect button as a last resort)
- A script running timer is now shown when running a script. This will help with the on XX seconds event block (this is an advanced block)
