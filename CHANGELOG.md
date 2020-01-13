# Change Log:

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
