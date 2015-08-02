## [0.0.1b] - 2015-08-03


### Fixed
- Decode: Decode of front zero padding fully fixed
- Decode & Encode: Reduction of 1 byte in a special case, when number of hex bytes is a multiple of 3.

### Bugs
- some error in multiple '-' character in encoding.
- some error in high number (>20) of space characters in decoding.