# A dropcolumn.com Reboot?

Who knows, I never finish things anyways. This particular iteration is intended to flesh out the idea of "synthesia", which is a tool for letting people select a color based on the song that is playing. The idea is to end up with a color pallette of what people think the song "looks like".

## Synthesia Development Notes

Navigate to "[http](http://localhost:3000/color)" to view this when the app is running in the dev environment.

### What's Left?
What is preventing me from saying this look good enough to go? 

- ✅ Submit - submit button needs to actually work with a backend storing the hex somewhere
- ✅ Forms - even for an MVP version, there should be at least 3 songs that people can choose colors to.
- Text color - text needs to change to reflect change in contrast when choosing color
- Finished page - some page needs to pop up to say thank you. ideally it displays the pallette they chose and eventually compare it to what other people have chosen
- Instructions - there should be a bit more instructions on the page for what people should do
- Navbar - need some kind of nav getting ppl back to home or at least dropcolumn.com


#### Flow

1. Fetch tracklist from AsyncStorage
2. Populate audio & track title
3. Enable submit hex color
4. Submit goes to next track
5. At end, show final page with results


## Development Versions

*Starting at the point where colors & palettes is mostly working...*

#### v0
- Can submit color based on song
- Can navigate between multiple songs
- Shows palettes page at the end

#### v0.0.1
- [ ] color contrast for hex text color
- [ x ] `#/color` URL syntax is broken
- [ x ] better navigation
- [ x ] reset link (during form)
- [ x ] home btn on palette screen
- [ x ] white bounding box stretches to full screen

#### v0.0.2a *(supabase conversion)*
- [ x ] All songs added to AWS S3
- [ x ] All songs added to supabase
- [ x ] Convert main functions from AsyncStorage to supabase

#### v0.0.2b *(supabase conversion)*
- [ x ] Fix navigation on color picker (pagination?) *mehhhh half-fixed...*
- [ x ] Ensure each song lines up with its title/id in the picker

#### v0.0.2c
- [ x ] Home page is ~~immediately synthesia~~ a welcome page to synthesia
- [ x ] All songs are added to be listened to
- [ x ] Palettes are saved to a single database
- [ - ] Remove dev buttons on palettes page
- [ - ] Improved navigation

#### v0.0.3
*Begin moving tracking to Notion*
- [ ] Move tracklist to a simple list on side instead of pagination
- [ ] Remove dev buttons on palettes page
- [ ] Improved navigation

### Future
[ ] Test that this works online
[ ] Navbar at top
[ ] Nav back to home or colors at palettes


## Helpful Links